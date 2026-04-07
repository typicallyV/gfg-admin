import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { DomainModel } from '../models/Domain';
import { LeaderModel } from '../models/Leader';

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get teams
 *     description: Retrieve domains and their members. Filter by domain name optional.
 *     tags: [Teams]
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teams
 */
export async function getTeams(req: NextRequest) {
  await connectToDatabase();
  const searchParams = req.nextUrl.searchParams;
  const domainQuery = searchParams.get('domain');

  const query: any = {};
  if (domainQuery) query.name = new RegExp(domainQuery, 'i');

  try {
    const domains = await DomainModel.find(query);
    return NextResponse.json({ domains, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/leaders:
 *   get:
 *     summary: Get leaders
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of leaders
 */
export async function getLeaders(req: NextRequest) {
  await connectToDatabase();
  try {
    const leaders = await LeaderModel.find({});
    return NextResponse.json({ leaders, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/domain:
 *   post:
 *     summary: Admin - Create a domain
 *     tags: [Admin Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Domain created
 */
export async function createDomain(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const domain = new DomainModel(body);
    await domain.save();
    return NextResponse.json({ domain, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/member:
 *   post:
 *     summary: Admin - Add member to domain
 *     tags: [Admin Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domainId:
 *                 type: string
 *               member:
 *                 type: object
 *     responses:
 *       201:
 *         description: Member added
 */
export async function createMember(req: NextRequest) {
  await connectToDatabase();
  try {
    const { domainId, member } = await req.json();
    const domain = await DomainModel.findById(domainId);
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    domain.members.push(member);
    await domain.save();
    return NextResponse.json({ domain, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/leaders:
 *   post:
 *     summary: Admin - Create a leader
 *     tags: [Admin Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Leader created
 */
export async function createLeader(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const leader = new LeaderModel(body);
    await leader.save();
    return NextResponse.json({ leader, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/domain/{id}:
 *   put:
 *     summary: Admin - Update a domain
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Domain updated
 */
export async function updateDomain(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const domain = await DomainModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    return NextResponse.json({ domain, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/member/{id}:
 *   put:
 *     summary: Admin - Update member details
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domainId:
 *                 type: string
 *               member:
 *                 type: object
 *     responses:
 *       200:
 *         description: Member updated
 */
export async function updateMember(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const { domainId, member } = await req.json();
    const domain = await DomainModel.findById(domainId);
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    const memberIndex = domain.members.findIndex((m: any) => m._id.toString() === params.id);
    if (memberIndex === -1) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    domain.members[memberIndex] = { ...domain.members[memberIndex].toObject(), ...member };
    await domain.save();

    return NextResponse.json({ domain, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/leaders/{id}:
 *   put:
 *     summary: Admin - Update a leader
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leader updated
 */
export async function updateLeader(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const leader = await LeaderModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!leader) return NextResponse.json({ error: 'Leader not found' }, { status: 404 });
    return NextResponse.json({ leader, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/domain/{id}:
 *   delete:
 *     summary: Admin - Delete a domain
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Domain deleted
 */
export async function deleteDomain(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const domain = await DomainModel.findByIdAndDelete(params.id);
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    return NextResponse.json({ message: 'Domain deleted successfully', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/member/{id}:
 *   delete:
 *     summary: Admin - Delete a member
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: domainId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted
 */
export async function deleteMember(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const searchParams = req.nextUrl.searchParams;
    const domainId = searchParams.get('domainId');

    if (!domainId) return NextResponse.json({ error: 'domainId required in query' }, { status: 400 });

    const domain = await DomainModel.findById(domainId);
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    domain.members = domain.members.filter((m: any) => m._id.toString() !== params.id);
    await domain.save();

    return NextResponse.json({ message: 'Member deleted successfully', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/leaders/{id}:
 *   delete:
 *     summary: Admin - Delete a leader
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leader deleted
 */
export async function deleteLeader(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const leader = await LeaderModel.findByIdAndDelete(params.id);
    if (!leader) return NextResponse.json({ error: 'Leader not found' }, { status: 404 });
    return NextResponse.json({ message: 'Leader deleted successfully', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
