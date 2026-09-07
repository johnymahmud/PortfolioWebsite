import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Standardized Success Response
 */
export function successResponse(data, meta = null, status = 200, message = 'Success') {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta,
      error: null,
    },
    { status }
  );
}

/**
 * Standardized Error Response
 */
export function errorResponse(message, status = 400, details = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      meta: null,
      error: {
        status,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Create privacy-safe salted IP hash
 */
export function getClientIpHash(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
  const salt = process.env.IP_HASH_SALT || 'shah-mahmud-portfolio-art-salt-2026';
  
  return crypto.createHmac('sha256', salt).update(rawIp).digest('hex').substring(0, 32);
}
