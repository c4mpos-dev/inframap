import { LegalPage, type LegalSection } from '@/features/legal/LegalPage'

const sections: LegalSection[] = [
  {
    title: 'O que o InfraMap é',
    body: (
      <p>
        Um projeto de extensão do Grupo 3 da AEDB para juntar, num mapa público, os problemas de
        infraestrutura de Resende que os moradores encontram no dia a dia.
      </p>
    ),
  },
  {
    title: 'O que o InfraMap não é',
    body: (
      <ul className="flex flex-col gap-1.5">
        <li>Não é canal oficial da prefeitura nem das concessionárias.</li>
        <li>
          Não garante conserto nem prazo. A equipe organiza e repassa os relatos; quem conserta é o
          órgão responsável.
        </li>
        <li>
          Não substitui os canais de emergência. Em caso de risco, ligue para a Defesa Civil (199)
          ou os Bombeiros (193).
        </li>
      </ul>
    ),
  },
  {
    title: 'O que não pode',
    body: (
      <ul className="flex flex-col gap-1.5">
        <li>Fotos com rosto de pessoas, placas de carro ou outros dados pessoais.</li>
        <li>Texto ofensivo, propaganda ou acusações contra pessoas.</li>
        <li>Relatos falsos ou que não sejam problemas de infraestrutura.</li>
      </ul>
    ),
  },
  {
    title: 'Moderação',
    body: (
      <p>
        A equipe pode juntar relatos repetidos e tirar do ar o que quebrar essas regras. Relatos
        tirados do ar saem do mapa e dos números.
      </p>
    ),
  },
  {
    title: 'Mudanças',
    body: (
      <p>
        Estes termos podem mudar ao longo do projeto. A data da última atualização fica no topo
        desta página quando a versão final for publicada.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Termos de uso"
      title="Combinados para usar o InfraMap"
      intro="Regras simples para o mapa continuar útil e seguro para todo mundo."
      sections={sections}
    />
  )
}
