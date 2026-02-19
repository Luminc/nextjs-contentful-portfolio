import { NextRequest, NextResponse } from 'next/server'

// Brevo hosted form endpoint — triggers the DOI confirmation email flow
const BREVO_FORM_URL = 'https://b87ede7b.sibforms.com/serve/MUIFAHPqJUXUrfblPQbnjkGYEF6rCv3YN39UbgIBa8GLHqmq_lIQOv_EY7WPS_yqiezAWi_438aVDaKkcWzPtXqzdTVN7IkhgyNnJpiDrUUtJ-IoxHVukp5P0TzDCNvfqCVincs2bLjedi5rbYFUehRCt2lhwebdD6y59SMBdp9jqD0BRfWpVE-o09xfb2ePi_85CVC_mdZ8x168'

export async function POST(req: NextRequest) {
  let email: string | undefined
  try {
    const body = await req.json()
    email = body.email
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const params = new URLSearchParams({ EMAIL: email, email_address_check: '', locale: 'en' })

  const res = await fetch(BREVO_FORM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    redirect: 'manual', // Brevo redirects on success — we handle navigation ourselves
  })

  // Brevo returns 302 redirect on success (to their own thank-you page)
  if (res.status === 200 || res.status === 302) {
    return NextResponse.json({ success: true })
  }

  console.error('Brevo form error:', res.status)
  return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 502 })
}
