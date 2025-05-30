export const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/^(\d{2})(\d)/, '($1) $2') // Adiciona os parênteses no DDD
    .replace(/(\d{5})(\d{1,4})/, '$1-$2') // Adiciona o traço no número
    .slice(0, 15); // Limita ao tamanho máximo
};
