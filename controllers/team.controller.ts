import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { DomainModel } from '../models/Domain';
import { LeaderModel } from '../models/Leader';
import { MentorModel } from '../models/Mentor';


/**
 * @swagger
 * /api/admin/teams/domain/{id}:
 *   get:
 *     summary: Admin - Get a domain
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Domain found
 */
export async function getDomain(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const domain = await DomainModel.findById(params.id);
    if (!domain) return NextResponse.json({ success: false, error: 'Domain not found' }, { status: 404 });
    return NextResponse.json({ domain, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving domain';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/leaders/{id}:
 *   get:
 *     summary: Admin - Get a leader
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leader found
 */
export async function getLeader(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const member = await LeaderModel.findById(params.id);
    if (!member) return NextResponse.json({ success: false, error: 'Leader not found' }, { status: 404 });
    return NextResponse.json({ member, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving leader';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/member/{id}:
 *   get:
 *     summary: Admin - Get a member
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 */
export async function getMember( req: NextRequest, { params }: { params: { id: string } } ) {
  await connectToDatabase();

  try {
    const domain = await DomainModel.findOne({
      "members._id": params.id,
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const member = domain.members.id(params.id);

    return NextResponse.json({
      member,
      success: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving member';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

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

  const query: Record<string, unknown> = {};
  if (domainQuery) {
    const sanitized = domainQuery.trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (sanitized) {
      query.name = new RegExp(sanitized, 'i');
    }
  }

  try {
    const domains = await DomainModel.find(query);
    return NextResponse.json(
      { success: true, domains },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error retrieving teams:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve teams.' },
      { status: 500 }
    );
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
export async function getLeaders() {
  await connectToDatabase();
  try {
    const leaders = await LeaderModel.find({});
    const domains = [{
      name: "Leaders",
      members: leaders
    }];
    return NextResponse.json(
      { success: true, domains },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error retrieving leaders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve leaders.' },
      { status: 500 }
    );
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating domain';
    return NextResponse.json({ error: message }, { status: 400 });
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
    const member = await req.json();
    const domain = await DomainModel.findOne({ name: member.domain });
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    domain.members.push(member);
    await domain.save();
    return NextResponse.json({ domain, success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating member';
    return NextResponse.json({ error: message }, { status: 400 });
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating leader';
    return NextResponse.json({ error: message }, { status: 400 });
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating domain';
    return NextResponse.json({ error: message }, { status: 400 });
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
    const member = await req.json();
    const currentDomain = await DomainModel.findOne({ "members._id": params.id });
    if (!currentDomain) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    const memberDoc = currentDomain.members.id(params.id);
    if (!memberDoc) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    // If domain changed, move member to new domain
    if (member.domain && member.domain !== currentDomain.name) {
      const targetDomain = await DomainModel.findOne({ name: member.domain });
      if (!targetDomain) return NextResponse.json({ error: 'Target domain not found' }, { status: 404 });

      // Remove from current domain
      currentDomain.members.pull(params.id);
      await currentDomain.save();

      // Add to target domain
      const updatedMemberData = { ...memberDoc.toObject(), ...member };
      targetDomain.members.push(updatedMemberData);
      await targetDomain.save();

      return NextResponse.json({ domain: targetDomain, success: true });
    }

    // Domain did not change: update in place
    Object.assign(memberDoc, member);
    await currentDomain.save();

    return NextResponse.json({ domain: currentDomain, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating member';
    console.error('Error updating member:', error);
    return NextResponse.json({ error: message }, { status: 400 });
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating leader';
    return NextResponse.json({ error: message }, { status: 400 });
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting domain';
    return NextResponse.json({ error: message }, { status: 500 });
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
    const domain = await DomainModel.findOne({
      "members._id": params.id,
    });
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    domain.members.pull(params.id);
    await domain.save();

    return NextResponse.json({ message: 'Member deleted successfully', success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting member';
    return NextResponse.json({ error: message }, { status: 500 });
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
    if (!leader) return NextResponse.json({ success: false, error: 'Leader not found' }, { status: 404 });
    return NextResponse.json({ message: 'Leader deleted successfully', success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting leader';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/mentors:
 *   get:
 *     summary: Get mentors
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of mentors
 */
export async function getMentors() {
  await connectToDatabase();
  try {
    const mentors = await MentorModel.find({});
    const domains = [{
      name: "Mentors",
      members: mentors
    }];
    return NextResponse.json(
      { success: true, domains },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error retrieving mentors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve mentors.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/admin/teams/mentors/{id}:
 *   get:
 *     summary: Admin - Get a mentor
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mentor found
 */
export async function getMentor(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const mentor = await MentorModel.findById(params.id);
    if (!mentor) return NextResponse.json({ success: false, error: 'Mentor not found' }, { status: 404 });
    return NextResponse.json({ member: mentor, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving mentor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/teams/mentors:
 *   post:
 *     summary: Admin - Create a mentor
 *     tags: [Admin Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Mentor created
 */
export async function createMentor(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const mentor = new MentorModel(body);
    await mentor.save();
    return NextResponse.json({ mentor, success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating mentor';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/mentors/{id}:
 *   put:
 *     summary: Admin - Update a mentor
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mentor updated
 */
export async function updateMentor(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const mentor = await MentorModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!mentor) return NextResponse.json({ success: false, error: 'Mentor not found' }, { status: 404 });
    return NextResponse.json({ mentor, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating mentor';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/teams/mentors/{id}:
 *   delete:
 *     summary: Admin - Delete a mentor
 *     tags: [Admin Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mentor deleted
 */
export async function deleteMentor(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const mentor = await MentorModel.findByIdAndDelete(params.id);
    if (!mentor) return NextResponse.json({ success: false, error: 'Mentor not found' }, { status: 404 });
    return NextResponse.json({ message: 'Mentor deleted successfully', success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting mentor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

