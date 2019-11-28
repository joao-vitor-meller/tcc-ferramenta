# tcc-ferramenta

Com o objetivo de disponibilizar a pesquisa, foi elaborada uma ferramenta web para realizar a busca do valor regional da terra de forma interativa. A ferramenta, é implementada utilizando a linguagem NodeJS, com a API do Google Maps, juntamente com a API do OpenStreetMaps, para facilitar a busca pelas propriedades dos produtores rurais, e calcular o valor da terra a partir da quantidade de hectares demarcados. 

Ao acessar a plataforma é obtido a informação da localização atual (cidade), do usuário através da geolocalização do Google, contendo também a opção de buscar outras localidades, e é criado um polígono de 3 vértices para ser ajustado com base na área de terra. 

Conforme o polígono é ajustado, é realizado o cálculo da área em metros quadrados e hectares. O usuário pode usar, para realizar o cálculo do valor dos hectares, os dados do banco de dados, ou inserir valores próprios, como o tipo de atividade, capacidade de produção e valor médio, através de uma calculadora. Ao final da seleção é disponibilizado o valor calculado da terra para as principais culturas regionais, acessando os dados através dos filtros de cidade e quantidade de hectares.

Na seção, denominada "pesquisa", é apresentada toda a análise gráfica, bem como a apresentação das variáveis através de gráficos interativos, que mostram a média do valor da terra para a cidade selecionada.

Esta ferramenta interativa busca integrar as principais funcionalidades já existentes em outros trabalhos, porém separadas em sistemas diferentes, como a busca por localidades, a seleção da área rural no mapa, a conversão para hectares, e a apresentação do valor estimado da terra. Além disso, é possível calcular o preço da área utilizando uma calculadora, por meio da inserção do valor da terra e da quantidade de hectares. 

A ferramenta possibilita ainda que os resultados obtidos com a pesquisa, como a estimativa de valores para os próximos anos, sejam visualizados por meio de gráficos, permitindo buscas, filtros e a interação dos usuários interessados.
