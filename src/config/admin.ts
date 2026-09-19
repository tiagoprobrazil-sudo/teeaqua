export const adminResources={
categorias:{table:'categories',title:'Categorias',fields:[['nome','Nome'],['slug','Slug'],['descricao','Descrição'],['imagem','Imagem (URL HTTPS)'],['ordem','Ordem']],active:'ativo'},
marcas:{table:'brands',title:'Marcas',fields:[['nome','Nome'],['slug','Slug'],['logo','Logo (URL HTTPS)']],active:'ativo'},
artigos:{table:'posts',title:'Artigos',fields:[['titulo','Título'],['slug','Slug'],['resumo','Resumo'],['conteudo','Conteúdo (parágrafos separados por linha em branco)'],['imagem','Imagem (URL HTTPS)'],['published_at','Publicação (data e hora)']],active:'publicado'}
} as const;
export type Resource=keyof typeof adminResources;

