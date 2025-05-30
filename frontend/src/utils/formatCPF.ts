export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '').slice(0, 11); // apenas números, até 11 dígitos

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
