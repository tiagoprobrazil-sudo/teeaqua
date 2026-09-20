import type { Category, Product, Post } from '../types/catalog';
import { media, photo } from '../config/media';
// Illustrative seed only. Never claims manufacturer, availability, or real specifications.
export const categories: Category[] = [
['Tratamento da água','tratamento-da-agua','Equilíbrio e cuidado em cada gota.','/images/categoria-tratamento-agua.jpg'],
['Limpeza','limpeza','Praticidade para uma piscina impecável.','/images/categoria-limpeza.jpg'],
['Bombas','bombas','Movimento que faz toda a diferença.','/images/categoria-bombas.jpg'],
['Filtros','filtros','A base de uma água cristalina.','/images/categoria-filtros.jpg'],
['Acessórios','acessorios','Os detalhes que completam o cuidado.',media.leisure],
['Iluminação','iluminacao','Uma nova atmosfera para sua piscina.',media.pool],
['Aquecimento','aquecimento','Conforto em todas as estações.',media.hero],
['Automação','automacao','Mais controle. Menos preocupação.',media.water],
['Peças e manutenção','pecas-e-manutencao','Cuidado para manter tudo funcionando.',media.pool],
].map(([nome,slug,descricao,imagem],ordem)=>({id:slug,nome,slug,descricao,imagem:photo(imagem,800),ordem,ativo:true}));
const examples = [
['Cloro granulado','cloro-granulado','Tratamento para o cuidado diário da água.',0,'treatment','/images/produto-cloro-granulado.jpg'],
['Algicida para piscinas','algicida-para-piscinas','Previne o surgimento de algas e mantém a água limpa e cristalina.',0,'treatment','/images/produto-algicida.jpg'],
['Kit teste para piscinas','kit-teste-para-piscinas','Análise rápida e precisa de pH e cloro livre.',0,'treatment','/images/produto-kit-teste.jpg'],
['Limpador automático para piscinas','limpador-automatico-para-piscinas','Limpeza eficiente do fundo e das paredes, com mangueira e acessórios.',1,'cleaning','/images/produto-limpador-automatico.jpg'],
] as const;
export const products: Product[] = examples.map(([nome,slug,descricao_curta,index,illustration,foto],ordem)=>({
id:slug,nome,slug,descricao_curta,categoria_id:categories[index].id,marca_id:null,
imagem_principal:foto||`/images/product-${illustration}.svg`,galeria:[],codigo:`DEMO-${String(ordem+1).padStart(3,'0')}`,
descricao:'Este item ilustra a organização do catálogo da T&E Aqua Solutions. A apresentação definitiva, o fabricante, a disponibilidade e as especificações serão publicados após a validação do catálogo comercial.',
especificacoes:{'Apresentação':'Exemplo ilustrativo','Especificações':'A confirmar no catálogo definitivo'},
destaque:ordem<4,ativo:true,ordem,created_at:'2026-09-19T00:00:00Z',updated_at:'2026-09-19T00:00:00Z',categories:categories[index],brands:null,demo:true,
}));
export const posts: Post[] = [
{ id:'rotina',titulo:'Uma boa rotina faz toda a diferença.',slug:'rotina-de-cuidados-com-a-piscina',resumo:'Organização e pequenos cuidados para aproveitar melhor sua piscina.',imagem:photo(media.water,900),conteudo:'Cuidar da piscina começa com uma rotina organizada. Observar a água, acompanhar a presença de folhas e verificar as condições dos acessórios ajuda a perceber quando é hora de buscar orientação.\n\nMantenha os materiais de limpeza organizados e siga as instruções de uso dos fabricantes. Registre as manutenções e as medições realizadas para facilitar o acompanhamento por um profissional.\n\nCada piscina tem características próprias. O volume, o sistema de filtração e a frequência de uso influenciam o cuidado necessário. Para escolher produtos e definir uma rotina adequada, converse com um profissional habilitado.',post_categories:{nome:'Manutenção',slug:'manutencao'}},
{ id:'equipamento',titulo:'Como escolher os equipamentos da sua piscina?',slug:'como-escolher-equipamentos',resumo:'Entenda o que considerar antes de escolher bombas, filtros e acessórios.',imagem:photo(media.hero,900),conteudo:'Um bom projeto começa com informações sobre a piscina. Volume, dimensões, tubulação e condições de instalação ajudam o profissional responsável a selecionar os equipamentos adequados.\n\nAntes de solicitar um orçamento, reúna os dados disponíveis do projeto e as referências dos equipamentos existentes. Fotografias da instalação também podem ajudar na conversa inicial.\n\nA escolha e a instalação devem seguir as orientações do fabricante e a avaliação de um profissional qualificado. A equipe da T&E Aqua pode ajudar você a encontrar os materiais para o seu projeto.',post_categories:{nome:'Equipamentos',slug:'equipamentos'}},
{ id:'momentos',titulo:'Prepare a piscina para os melhores momentos.',slug:'prepare-a-piscina-para-aproveitar',resumo:'Planeje os cuidados e deixe mais espaço na agenda para o lazer.',imagem:photo(media.leisure,900),conteudo:'Planejar o cuidado da piscina antes dos dias de lazer evita deixar tudo para a última hora. Confira com antecedência os materiais disponíveis e programe a manutenção necessária.\n\nOrganize a área externa, guarde acessórios após o uso e mantenha os produtos em suas embalagens originais, conforme as orientações do fabricante.\n\nPara dúvidas sobre produtos, compatibilidade ou manutenção, busque orientação especializada. Assim, você prepara o ambiente para aproveitar com mais tranquilidade.',post_categories:{nome:'Limpeza',slug:'limpeza'}},
].map(p=>({...p,categoria_id:null,publicado:true,published_at:null,updated_at:'2026-09-19T00:00:00Z'}));

