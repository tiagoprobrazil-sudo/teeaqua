export interface Category { id: string; nome: string; slug: string; descricao: string; imagem: string; ordem: number; ativo: boolean }
export interface Brand { id: string; nome: string; slug: string; logo: string | null; ativo: boolean }
export interface Product {
  id: string; nome: string; slug: string; descricao_curta: string; descricao: string;
  categoria_id: string | null; marca_id: string | null; imagem_principal: string;
  galeria: string[]; codigo: string; especificacoes: Record<string, string>;
  destaque: boolean; ativo: boolean; ordem: number; created_at: string; updated_at: string;
  categories?: Category | null; brands?: Brand | null; demo?: boolean;
}
export interface Post { id: string; titulo: string; slug: string; resumo: string; conteudo: string; imagem: string; categoria_id: string | null; publicado: boolean; published_at: string | null; updated_at: string; post_categories?: { nome: string; slug: string } | null }
