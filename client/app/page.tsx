import Image from "next/image";

export default function Home() {
  return (
    <main>
      Dev Deployments
      <Image
        src="/rahul_mishra.jpg"
        alt="Vercel Logo"
        width={100}
        height={24}
      />
    </main>
  );
}
