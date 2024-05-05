export const apiErrorStatusMessage: {[key: number]: string} = {
  0: 'Falha no carregamento dos dados, verifique sua conexão ou entre em contato com o suporte.',
  400: 'O pedido enviado ao servidor estava incorreto. Verifique os dados fornecidos e tente novamente.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Acesso negado. Você não tem permissão para visualizar esta página ou recurso.',
  404: 'A página que você está procurando não pôde ser encontrada. Verifique o URL e tente novamente.',
  405: 'Método não permitido. O método de solicitação não é suportado para o recurso solicitado.',
  409: 'Houve um conflito ao processar sua solicitação. Por favor, revise suas informações.',
  500: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou entre em contato com o suporte.',
  502: 'O serviço da VTEX não está disponível no momento. Tente novamente mais tarde.',
  503: 'O serviço não está disponível no momento devido a sobrecarga ou manutenção. Tente novamente mais tarde.',
  504: 'Tempo limite da solicitação. O servidor não respondeu a tempo.',
};

export const MESSAGE_VALIDATORS = {
  REQUIRED: 'Esse campo é obrigatório',
  SPECIAL_CHARS: 'Esse campo não permite caracteres especiais',
  ALPHANUMERIC: 'Este campo permite apenas letras e números',
  SPECIAL_CHARS_SELLER: 'Este campo não permite caracteres especiais, com exceção do hífen (-)',
  INVALID_EMAIL: 'Email inválido',
  INVALID_CPF: 'CPF inválido',
  INVALID_AGE: 'Idade menor que 18 anos',
  INVALID_BIRTH_YEAR_RANGE: 'O ano inserido excede o limite de 100 anos',
  NAME_EXISTS: 'Esse nome de produto já está sendo utilizado em outro produto',
  REF_ID_EXISTS: 'Esse código de referência já está sendo utilizado em outro produto/sku',
  EAN_EXISTS: 'Esse EAN já está sendo utilizado em outro produto/sku',
  EMAIL_EXISTS: 'Este e-mail já está sendo usado por outro usuário',
  ZIP_CODE_START_GREATER_ZIP_CODE_END: 'O CEP inicial não pode ser maior que o CEP final',
  WEIGHT_START_FREATER_WEIGHT_END: 'O peso inicial não pode ser maior que o peso final',

  MAX_LENGTH: (requiredLength: number) =>
    `O campo não pode ter mais de ${requiredLength} caracteres`,
  MIN_LENGTH: (requiredLength: number) =>
    `O campo não pode ter menos de ${requiredLength} caracteres`,
  MAX: (requiredValue: number) => 'O valor máximo é ' + requiredValue,
  MIN: (requiredValue: number) => 'O valor mínimo é ' + requiredValue,
  NOT_INTEGER: 'Esse campo aceita apenas valores inteiros',
  NEGATIVE_NUMBER: 'Esse campo aceita apenas valores inteiros e positivos',
  CRM_VALIDATOR: 'o CRM precisa estar no formato CRM-0000',
};
