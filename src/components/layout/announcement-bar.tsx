import { Container } from '@/components/ui';

interface AnnouncementBarProps {
  message?: string;
}

function AnnouncementBar({
  message = 'Discover your beauty essentials with STYLONE — Free delivery on orders above Rs. 3,000',
}: AnnouncementBarProps) {
  return (
    <div className="bg-[var(--color-text-primary)] text-white py-2 relative overflow-hidden">
      <Container>
        <p className="text-center text-xs sm:text-sm tracking-wide font-light truncate">
          {message}
        </p>
      </Container>
    </div>
  );
}

export { AnnouncementBar };
