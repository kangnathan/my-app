import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function isAlphaNumeric(x) {
  const regex = /^[a-zA-Z0-9\s]*$/; 
  return regex.test(x);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req) {
  const errors = {};
  const formData = await req.json();

  const ourUser = {
    name: formData.name || '',
    email: formData.email || '',
    password: formData.password || ''
  };

  ourUser.name = ourUser.name.trim();
  ourUser.email = ourUser.email.trim();
  ourUser.password = ourUser.password.trim();

  // validate Username
  if (!ourUser.name) {
    errors.name = 'You must provide a username.';
  } else if (ourUser.name.length < 3) {
    errors.name = 'Username must be at least 3 characters.';
  } else if (ourUser.name.length > 30) {
    errors.name = 'Username cannot exceed 30 characters.';
  } else if (!isAlphaNumeric(ourUser.name)) {
    errors.name = 'Usernames can only contain letters, numbers, and spaces.';
  }

  // check if the username is already in use
  const usernameInQuestion = await prisma.user.findFirst({
    where: { name: ourUser.name }
  });
  if (usernameInQuestion) {
    errors.name = 'That username is already in use.';
  }

  // validate email
  if (!ourUser.email) {
    errors.email = 'You must provide an email address.';
  } else if (!validateEmail(ourUser.email)) {
    errors.email = 'Please provide a valid email address.';
  } else {
    // check if the email is already in use
    const emailInQuestion = await prisma.user.findFirst({
      where: { email: ourUser.email }
    });
    if (emailInQuestion) {
      errors.email = 'That email address is already in use.';
    }
  }

  // validate password
  if (!ourUser.password) {
    errors.password = 'You must provide a password.';
  } else if (ourUser.password.length < 12) {
    errors.password = 'Password must be at least 12 characters.';
  } else if (ourUser.password.length > 50) {
    errors.password = 'Password cannot exceed 50 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors: errors, success: false }, { status: 400 });
  }

  // create the user if validation passes
  try {
    const salt = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: ourUser.name,
        email: ourUser.email,
        password: ourUser.password
      }
    });

    const jwtSecret = process.env.JSWTOKEN;
    const ourTokenValue = jwt.sign(
      { skyColor: 'blue', userId: newUser.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
      jwtSecret
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set('mycrudapp', ourTokenValue, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Error during user registration:', error.message || error);
    return NextResponse.json({
      error: 'Internal server error.',
      success: false
    }, { status: 500 });
  }
}
