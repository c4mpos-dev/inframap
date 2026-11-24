import { PROJECT_CONTACT_EMAIL } from '@/domain/project'
import { LegalPage, type LegalSection } from '@/features/legal/LegalPage'

const contact = PROJECT_CONTACT_EMAIL ?? '[e-mail do projeto]'

const sections: LegalSection[] = [
  {
    title: 'O que a gente coleta',
    body: (
      <ul className="flex flex-col gap-1.5">
        <li>
          O ponto no mapa onde está o problema, a categoria, a descrição e a foto, se você mandar.
        </li>
        <li>
          As confirmações de “eu também vi”, para contar quantas pessoas viram o mesmo problema.
        </li>
        <li>
          O e-mail da sua conta e o nome que você escolher. No relato público aparece só o primeiro
          nome e a inicial do sobrenome, ou nada, se você ocultar o nome.
        </li>
      </ul>
    ),
  },
  {
    title: 'O que a gente não pede',
    body: (
      <p>
        CPF, telefone ou endereço da sua casa. O relato é sobre o problema da rua, não sobre você.
      </p>
    ),
  },
  {
    title: 'O que fica público',
    body: (
      <>
        <p>
          Tudo que está no relato aparece no mapa para qualquer pessoa: foto, descrição, categoria,
          bairro e situação. Quem marcou nunca aparece.
        </p>
        <p>
          Antes de enviar, a foto é reduzida no seu aparelho e perde os dados escondidos do arquivo,
          como a localização do GPS e o modelo do celular. Mesmo assim, evite fotografar rostos e
          placas de carro.
        </p>
      </>
    ),
  },
  {
    title: 'Para que os dados servem',
    body: (
      <p>
        Para mostrar os problemas no mapa, calcular os indicadores do projeto e organizar os relatos
        que são levados à prefeitura e às concessionárias. Os dados enviados a esses órgãos são os
        relatos e números agregados, sem identificar quem marcou.
      </p>
    ),
  },
  {
    title: 'Como pedir para tirar um relato',
    body: (
      <p>
        Em qualquer relato, use “Denunciar foto ou texto impróprio”. A equipe confere e tira do ar o
        que tiver dado pessoal ou conteúdo impróprio. Também dá para pedir pelo e-mail {contact}.
      </p>
    ),
  },
  {
    title: 'Seus direitos',
    body: (
      <p>
        Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir para ver, corrigir ou
        apagar os dados ligados a você. É só escrever para {contact}.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacidade e LGPD"
      title="Seus dados no InfraMap"
      intro="O InfraMap coleta o mínimo para o mapa funcionar. Aqui está o que entra, o que fica público e como pedir para tirar algo do ar."
      sections={sections}
    />
  )
}
