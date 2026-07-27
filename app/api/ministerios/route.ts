import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import { verify } from 'jsonwebtoken';
import { hasPermission } from '@/lib/permissions';

export async function GET() {
  const rows = await sql`
    SELECT m.*,
      (SELECT count(*)::int FROM ministerio_membros mm WHERE mm.ministerio_id = m.id) as total_membros
    FROM ministerios m ORDER BY m.ordem ASC, m.nome ASC
  `
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  try {
    // Authentication: Extract and verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = process.env.AUTH_MOBILE_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_MOBILE_SECRET or AUTH_SECRET not configured');
    }

    const decoded = verify(token, secret) as any;
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Authorization: Check if user has permission to create ministries
    const canCreate = await hasPermission(userId, 'ministerios:create');
    
    if (!canCreate) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Você não tem permissão para criar ministérios' 
        },
        { status: 403 }
      );
    }

    // Validation
    const { nome, descricao, cor, icone, ordem } = await request.json()
    if (!nome) {
      return NextResponse.json({ error: "nome obrigatório" }, { status: 400 })
    }

    // Create ministry
    const rows = await sql`
      INSERT INTO ministerios (nome, descricao, cor, icone, ordem)
      VALUES (${nome}, ${descricao ?? null}, ${cor ?? "#D4C5B0"}, ${icone ?? "⛪"}, ${ordem ?? 0})
      RETURNING *
    `
    
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    console.error('Error creating ministry:', error);
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create ministry', details: error.message },
      { status: 500 }
    );
  }
}
