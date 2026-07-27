import { NextRequest, NextResponse } from 'next/server';
import { getAccountPermissions, getAccountRoles } from '@/lib/permissions';
import { verify } from 'jsonwebtoken';

/**
 * GET /api/auth/permissions
 * 
 * Returns the authenticated user's permissions and roles
 * This endpoint is used by the mobile app to check permissions client-side
 * 
 * @requires Authorization header with Bearer token
 * @returns {
 *   permissions: Array<{ name, display_name, category }>,
 *   roles: Array<{ role_name, role_display_name, context_type, context_name }>,
 *   journey_stage: string
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const secret = process.env.AUTH_MOBILE_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_MOBILE_SECRET or AUTH_SECRET not configured');
    }

    const decoded = verify(token, secret) as any;
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token: missing user ID' },
        { status: 401 }
      );
    }
    
    // Get permissions and roles
    const [permissions, roles] = await Promise.all([
      getAccountPermissions(userId),
      getAccountRoles(userId),
    ]);
    
    // Get user's journey stage
    const { sql } = await import('@/lib/neon');
    const accountResult = await sql`
      SELECT journey_stage FROM accounts WHERE id = ${userId}::uuid
    `;
    
    const journeyStage = accountResult[0]?.journey_stage || 'visitante';
    
    return NextResponse.json({
      permissions: permissions.map(p => ({
        name: p.permission_name,
        display_name: p.permission_display_name,
        category: p.permission_category,
      })),
      roles: roles.map(r => ({
        role_name: r.name,
        role_display_name: r.display_name,
        context_type: r.context_type,
        context_name: r.context_name,
      })),
      journey_stage: journeyStage,
    });
  } catch (error: any) {
    console.error('Error in permissions endpoint:', error);
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to get permissions', details: error.message },
      { status: 500 }
    );
  }
}
