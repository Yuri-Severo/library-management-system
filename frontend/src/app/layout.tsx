import type { Metadata } from 'next';
import './globals.css';
import { FONTS } from '@/lib/fonts';

export const metadata: Metadata = {
  title: '🧙‍♂️ Bibliomancer - O Sistema que o Isaac Usaria se Tivesse Tempo',
  description:
    'Forjado nos laboratórios ocultos do CESUPA durante um eclipse de provas finais, Bibliomancer é o sistema bibliotecário que Isaac Elgrably — Mago do SQL, Encantador de UMLs e Arqui-inimigo das planilhas do Excel — teria criado se não estivesse ocupado salvando o Amazon Hacking de incêndios metafóricos, corrigindo 57 projetos ao mesmo tempo e fugindo sorrateiramente da coordenadora Baganha em alta velocidade pelos corredores do terceiro andar. Com feitiços de cadastro, rituais de empréstimo, magias de consulta, encantamentos de inativação lógica e um histórico arcano de alterações, o Bibliomancer transforma o caos bibliotecário em pura fluidez mágica. Suas validações místicas detectam CPFs duplicados, e seus testes de integração são mais poderosos que um DELETE sem WHERE. Destinado aos bravos bibliotecários que cansaram de depender da sorte e dos arquivos .xlsx da maldição ancestral, este sistema não apenas gerencia usuários e acervos — ele canaliza o poder oculto da boa arquitetura de software, invocando REST, MVC, e talvez até o Isaac para fazer code review com olhos brilhando em ANSI SQL.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${FONTS.inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
