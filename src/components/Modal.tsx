import Image from "next/image";
import { Container } from "./common/BaseContainer";
import { Button } from "./common/Button";
import Typography from "./common/Typography";

export function Modal({
  title,
  children,
  onClose,
  isOpen,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <>
      {isOpen && (
        <Container slim className="modal z-50 mx-auto w-screen">
          <Container className="backdrop flex items-center">
            <Container className="shell !bg-bg  relative overflow-hidden rounded-none md:rounded-3xl">
              <Container className="p-4 text-center ">
                <Typography.Medium>{title}</Typography.Medium>
              </Container>
              <Container slim className="modal-body bg-bg">
                {children}
              </Container>
              <Button
                onClick={onClose}
                className="border-0 flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link absolute right-[20px] top-[20px]"
              >
                <Image src="/icons/x.svg" height={18} width={18} alt="close" />
              </Button>
            </Container>
          </Container>
        </Container>
      )}
    </>
  );
}
