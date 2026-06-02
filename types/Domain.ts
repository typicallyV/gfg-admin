export type TeamMember = {
  _id: string
  firstname: string
  lastname: string
  role: string
  photo: string
  githubUrl: string
  linkedinUrl: string
  svgvector: string
  backgroundColor: string
}

export type Domain = {
  _id: string
  name: string
  members: TeamMember[]
}