import { redirect } from 'next/navigation';

export default function TrackingIdentifierPage({ params }: { params: { identifier: string } }) {
  redirect(`/tracking?tracking=${encodeURIComponent(params.identifier)}`);
}