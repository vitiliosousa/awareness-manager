import Link from "next/link";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { Logo, botaoPrimario } from "@/components/ui";

/** Depois de terminar sessão. Volta-se a entrar com um link novo, pedido com o email (como na app do formando, sem palavra-passe). */
export default function SessaoTerminada() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo grande />
        </div>
        <section className="mt-10 rounded-[18px] border border-linha bg-superficie p-7">
          <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-[14px] bg-energia-claro text-tinta">
            <Icone icon={Mail01Icon} size={26} />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Sessão terminada</h1>
          <p className="mt-2 text-suave">Para voltar a ver os resultados da tua empresa, pede um link de acesso com o teu email. Não há palavra-passe para esquecer.</p>
          <Link href="/entrar" className={`${botaoPrimario} mt-6 w-full`}>
            Pedir um link de acesso
          </Link>
        </section>
      </div>
    </main>
  );
}
