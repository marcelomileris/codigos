import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('metadata_product_FK', ['fkIdProduct'], {})
@Index('pk_metadata_product', ['id'], { unique: true })
@Entity('metadata_product', { schema: 'public' })
export class MetadataProduct {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'numeroSequencia',
    nullable: true,
    length: 6,
  })
  numeroSequencia: string | null;

  @Column('boolean', { name: 'ativo' })
  ativo: boolean;

  @Column('boolean', { name: 'produtoAtivoECommerce', default: () => 'false' })
  produtoAtivoECommerce: boolean;

  @Column('varchar', { name: 'cnae', nullable: true, length: 200 })
  cnae: string | null;

  @Column('varchar', {
    name: 'cnpj_fornecedor',
    nullable: true,
    length: 100,
  })
  cnpjFornecedor: string | null;

  @Column('varchar', {
    name: 'cnpj_fornecedor_escala_nao_relevante',
    nullable: true,
    length: 100,
  })
  cnpjFornecedorEscalaNaoRelevante: string | null;

  @Column('varchar', {
    name: 'codigo_alternativo',
    nullable: true,
    length: 20,
  })
  codigoAlternativo: string | null;

  @Column('varchar', {
    name: 'codigo_classificacao_fiscal',
    nullable: true,
    length: 20,
  })
  codigoClassificacaoFiscal: string | null;

  @Column('varchar', {
    name: 'codigo_item_servico',
    nullable: true,
    length: 4,
  })
  codigoItemServico: string | null;

  @Column('varchar', { name: 'codigo_padrao', length: 120 })
  codigoPadrao: string;

  @Column('integer', { name: 'fk_id_product' })
  fkIdProduct: number;

  @Column('varchar', {
    name: 'codigo_produto_por_fornecedor',
    nullable: true,
    length: 200,
  })
  codigoProdutoPorFornecedor: string | null;

  @Column('varchar', {
    name: 'descricao_tipo_produto',
    nullable: true,
    length: 50,
  })
  descricaoTipoProduto: string | null;

  @Column('boolean', { name: 'escala_nao_relevante', nullable: true })
  escalaNaoRelevante: boolean | null;

  @Column('varchar', { name: 'ippt', nullable: true, length: 1 })
  ippt: string | null;

  @Column('boolean', { name: 'indicador_arredondamento', nullable: true })
  indicadorArredondamento: boolean | null;

  @Column('boolean', { name: 'inserir_classificacao', nullable: true })
  inserirClassificacao: boolean | null;

  @Column('text', { name: 'produto_fornecedores_content', nullable: true })
  produtoFornecedoresContent: string | null;

  @Column('integer', { name: 'situacao_tributaria_origem', nullable: true })
  situacaoTributariaOrigem: number | null;

  @Column('boolean', { name: 'situacao_venda', nullable: true })
  situacaoVenda: boolean | null;

  @Column('text', { name: 'unidades_negocio', nullable: true })
  unidadesNegocio: string | null;

  @Column('varchar', {
    name: 'descricao_classificacao',
    nullable: true,
    length: 100,
  })
  descricaoClassificacao: string | null;

  @Column('varchar', {
    name: 'descricao_tipo_classificacao',
    nullable: true,
    length: 100,
  })
  descricaoTipoClassificacao: string | null;

  @Column('timestamp', {
    name: 'created',
    default: () => 'now()',
  })
  created: Date;

  @Column('timestamp', {
    name: 'updated',
    default: () => 'now()',
  })
  updated: Date;

  @Column('varchar', { name: 'codigo_principal', length: 120 })
  codigoPrincipal: string;

  @Column('real', { name: 'desconto_maximo', nullable: true, precision: 24 })
  descontoMaximo: number | null;

  @Column('real', {
    name: 'desconto_venda_promocao',
    nullable: true,
    precision: 24,
  })
  descontoVendaPromocao: number | null;

  @Column('varchar', { name: 'descricao', length: 200 })
  descricao: string;

  @Column('varchar', { name: 'descricao_resumida', length: 100 })
  descricaoResumida: string;

  @Column('text', { name: 'especificacaoTecnica', nullable: true })
  especificacaoTecnica: string | null;

  @Column('real', { name: 'peso_bruto', precision: 24, default: () => '0' })
  pesoBruto: number;

  @Column('real', { name: 'peso_liquido', precision: 24, default: () => '0' })
  pesoLiquido: number;

  @Column('varchar', {
    name: 'sigla_unidade_medida',
    length: 10,
    default: () => "'UUN'",
  })
  siglaUnidadeMedida: string;

  @Column('boolean', { name: 'preco_centralizado', default: () => 'false' })
  precoCentralizado: boolean;

  @Column('integer', { name: 'quantidade_casa_decimal', nullable: true })
  quantidadeCasaDecimal: number | null;

  @Column('integer', { name: 'quantidade_casa_decimal_valor', nullable: true })
  quantidadeCasaDecimalValor: number | null;

  @Column('varchar', {
    name: 'quantidade_multipla_compra',
    nullable: true,
    length: 10,
  })
  quantidadeMultiplaCompra: string | null;

  @Column('real', { name: 'altura', nullable: true, precision: 24 })
  altura: number | null;

  @Column('real', { name: 'comprimento', nullable: true, precision: 24 })
  comprimento: number | null;

  @Column('real', { name: 'largura', nullable: true, precision: 24 })
  largura: number | null;

  @Column('varchar', { name: 'marca', nullable: true, length: 255 })
  marca: string | null;

  @Column('integer', { name: 'fk_subcategoria', nullable: true })
  fkSubcategoria: number | null;

  @Column('varchar', {
    name: 'code_subcategoria',
    nullable: true,
    length: 100,
  })
  codeSubcategoria: string | null;

  @Column('varchar', {
    name: 'code_categoria',
    nullable: true,
    length: 40,
  })
  codeCategoria: string | null;
}
