import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Image src="/pib-logo-black.png" alt="PIB Roraima" width={120} height={40} className="h-10 w-auto mb-8" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Sem conexão</h1>
      <p className="text-gray-500 text-sm max-w-xs">
        Você está offline. Verifique sua conexão com a internet e tente novamente.
      </p>
    </div>
  );
}
