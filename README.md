# Looks Profile Phoenix

Edição exclusiva para o cliente Phoenix x64 100.2, versão 1.3.4-phoenix.5. Mantém o formato dos perfis JSON do Looks Profile e inclui o tratamento específico de aparência e catálogo do Phoenix.

Importação: copie os arquivos JSON para `profiles`. Para manter os retratos, copie também os PNG correspondentes para `icons`, sem mudar seus nomes. O formato dos perfis permanece `looks-profile`, versão 1. Nenhum perfil é convertido ou sobrescrito pela importação.

Esta edição usa a interface original do Phoenix, com a extensão do catálogo e o adaptador de leitura do Toolbox Classic com suporte ao Phoenix. O adaptador fornece ao criador uma cópia do recurso com os perfis, sem alterar o arquivo original do jogo ou seus mapas. Mudanças no recurso ativo do Phoenix são recusadas até nova análise.

A pasta do módulo continua `looks-profile-manager`, para manter a seleção já existente no Toolbox. Não carregue simultaneamente outra edição do mesmo módulo neste Toolbox.

## Aparência importada no Phoenix

Perfis antigos importados do Asura são tratados como origem Asura. A referência verificada contém opções de Humanos e Castanics. Ao montar o catálogo, o mod compara modelos, valores das cores e brilho, decalques e controles faciais com os dados reais do Phoenix. Usa somente correspondência exata; opções sem equivalência inequívoca são recusadas, sem escolher uma cor aproximada. Para raças sem referência, mantém o comportamento por ID e informa a limitação no registro.

Os perfis novos ou atualizados nesta edição recebem `appearanceOrigin: "phoenix"`, para preservar os IDs próprios do Phoenix. O formato do perfil continua versão 1. Os JSON importados não são regravados nem convertidos no disco.

Os IDs de cabelo, pele, rosto e demais opções são procurados pelo valor salvo no perfil, independentemente da ordem em que o Phoenix apresenta as opções. Se um ID não estiver disponível, a aplicação é interrompida; nenhuma opção substituta é escolhida. Os arquivos JSON importados não são alterados. Recursos e cores personalizados pelo próprio servidor podem ter aparência diferente de outros clientes.


---

# Looks Profile

Salve a aparência de personagens do TERA e escolha seus perfis como presets em **Customize → Presets**, com retratos opcionais e ajustes de **Fine Details**.

Todos os perfis compatíveis aparecem juntos no criador. Não é necessário preparar ou ativar cada um.

## Demonstração

<p align="center">
  <img src="https://raw.githubusercontent.com/emilia-s2/looks-profile/assets/overview.gif" alt="Demonstração do Looks Profile" />
</p>

## Instalação

1. Coloque a pasta `looks-profile-manager` em `tera-toolbox/mods`.
2. Inicie o Toolbox antes de abrir o TERA. Para usar a janela de perfis, execute o Toolbox em modo gráfico.

**Compatibilidade:** Phoenix PC x64, versão 100.2, com a interface e o adaptador de recursos compatíveis. Esta edição não substitui o Looks Profile padrão de outros clientes. O mod recusa interfaces com assinatura diferente.

## Como usar

1. Dentro do jogo, use **Ctrl+Alt+L** ou digite `/8 lookprofile` para abrir a janela.
2. Em **Salvar perfil**, escolha **Meu personagem** para usar o personagem com que você entrou no mundo. Para copiar outro personagem seu da seleção ou um jogador visível no mapa, escolha **Outro personagem pelo nome** e informe o nome exato. Dê um nome ao novo perfil ou deixe vazio para usar o nome do personagem. A lista de nomes tem barra de rolagem; você também pode digitar para filtrar as sugestões ou informar o nome completo.
3. Reabra **somente o TERA**, mantendo o Toolbox iniciado, para atualizar o catálogo.
4. No criador, escolha raça, gênero e classe, entre em **Customize → Presets** e clique em um dos seus presets ao lado do botão aleatório.

Somente perfis da mesma raça e gênero aparecem; a classe pode ser diferente. Passe o mouse para ver o nome e use as setas quando houver mais presets.

Aguarde a mensagem de conclusão antes de ajustar o personagem. A aplicação pode levar alguns segundos; mexer nos controles durante esse processo interrompe a fila. Depois, você pode editar o visual ou escolher outro preset. Confira o resultado antes de clicar em **Complete**.

**Já tem perfis salvos?** Coloque os JSON na pasta `profiles` antes de abrir o jogo. Eles também ficam disponíveis para criar seu primeiro personagem, sem comandos ou edição de configuração.

## Idioma da janela

Use **Idioma**, no topo da GUI, para escolher **Automático**, **Português**, **English** ou **Español (Latinoamérica)**. A troca é imediata e fica salva em `config.json`, no campo `data.language`: `auto`, `pt`, `en` ou `es`. O modo automático usa o idioma do sistema; idiomas fora desses três usam inglês. Não é necessário instalar os mods de guia.

### Português

<p align="center">
  <img src="https://raw.githubusercontent.com/emilia-s2/looks-profile/assets/ui-pt.gif" alt="Janela do Looks Profile em português" />
</p>

### Inglês (English)

<p align="center">
  <img src="https://raw.githubusercontent.com/emilia-s2/looks-profile/assets/ui-en.gif" alt="Looks Profile window in English" />
</p>

## Retratos opcionais

Em **Salvar perfil**, clique no quadro do retrato ou em **Adicionar retrato**. Na janela que abrir, use **Escolher imagem do computador** para um arquivo PNG/JPEG ou **Colar captura da tela** para uma imagem copiada. Enquadre o rosto e confirme em **Usar este recorte**. O retrato é opcional e vira o ícone do preset; os dados de aparência vêm do personagem escolhido, independentemente da imagem.

Para um perfil existente, selecione-o em **Perfis salvos**. O retrato aparece abaixo do título da aba; clique no quadro ou em **Adicionar retrato / Trocar retrato**. A seleção nessa janela serve para consultar o perfil e editar o retrato; a aparência é escolhida no criador.

Os ícones têm 64 × 64 pixels. Prefira uma captura com o rosto próximo e compare a opção **Nitidez suave**. Reabra somente o TERA para atualizar os ícones no criador. Sem retrato, o botão mostra “Preset 1”, “Preset 2” etc. A captura não é automática.

## Atualizar ou excluir um perfil

Em **Perfis salvos**, selecione o perfil desejado:

- **Atualizar com meu personagem**: disponível dentro do mundo, substitui a aparência salva pelos dados recebidos do personagem conectado. Mantém o nome do perfil e seu retrato. A confirmação mostra o perfil e o personagem de origem.
- **Excluir perfil**: após confirmação, remove o arquivo do perfil e o retrato associado. Não exclui nenhum personagem do jogo. A janela não oferece desfazer.

A lista da GUI é atualizada imediatamente. Reabra **somente o TERA**, com Toolbox iniciado, para o catálogo do criador refletir atualizações e exclusões. Isso não captura ajustes ainda não confirmados na tela de customização.

## Comandos

| Comando | Função |
| --- | --- |
| `/8 lookprofile` | Abrir a janela de perfis. |
| `/8 lookprofile save self Nome do perfil` | Salvar seu personagem pelo chat. |
| `/8 lookprofile status` | Consultar o registro do catálogo e a sessão. |
| `/8 lookprofile reload` | Atualizar a lista da janela. |

Atualizar a lista não substitui o catálogo já carregado no jogo: perfis e retratos novos exigem reabrir o TERA. Voltar ao login ou parar/iniciar o Toolbox com o mesmo jogo aberto não atualiza esse catálogo.

`config.json` é criado localmente pelo mod e mantido pelo Toolbox para preferências. Ele não faz parte do pacote publicado nem do manifest de atualização. Não guarda perfil padrão: os campos antigos são removidos automaticamente. A janela abre sem perfil selecionado e nenhum preset é aplicado até você clicar nele no criador. Os comandos antigos de preparação não ativam perfis.

<details>
<summary>Arquivos e limites</summary>

- `profiles`: dados dos perfis; até 64 no catálogo. Arquivos inválidos são ignorados com aviso, sem serem apagados.
- `icons`: retratos opcionais. Guarde essas duas pastas para transferir seus presets.
- `preview-cache`: pacote temporário da interface. A limpeza remove os pacotes gerados de processos encerrados; não apaga os perfis.
- O Toolbox registra uma interface temporária; os arquivos originais do jogo não são modificados.
- São aplicados cabelo, rosto, cores, adornos, voz e até 30 controles de Fine Details. `shape` e `appearance2` são preservados no perfil, mas não aplicados pelos controles mapeados.
- “Registrado” no log confirma o carregamento pelo Toolbox; confira a mensagem de conclusão e a aparência no criador.

</details>


## Distribuição e atualizações desta edição

Repositório exclusivo: https://github.com/emilia-s2/looks-profile-phoenix, branch `main`. As atualizações automáticas estão habilitadas para esse endereço e continuam respeitando as preferências do Toolbox. Esta edição mantém o nome interno e a pasta `looks-profile-manager`; não carregue duas edições do mod no mesmo Toolbox. Se baixar o ZIP, renomeie a pasta extraída para `looks-profile-manager` antes de colocá-la em `mods`.

Novas versões do catálogo exigem reabrir o TERA com o Toolbox já aberto. Atualizar a lista da GUI não recompõe a interface de uma sessão em andamento.

## Preparação local do pacote

Na pasta `D:\looks-profile-phoenix`, execute `sincronizar-pacote.bat` para copiar arquivos novos ou modificados de `C:\Users\Astrix\Desktop\tera-toolbox\mods\looks-profile-manager`. O script valida que a origem é a edição Phoenix, gera `manifest.json` com hashes SHA-256 e preserva os recursos binários byte a byte. Ele não faz commit nem push.

Use `sincronizar-pacote.bat --check` para conferir sem alterar arquivos, ou `manifest-generator.bat` para recalcular apenas o manifesto do pacote já copiado. As ferramentas locais são ignoradas no Git e não acompanham as atualizações.

`profiles/`, `icons/`, `preview-cache/`, `config.json`, relatórios e arquivos de teste não entram na sincronização nem no Git. O componente `lib/ui-baseline-test.js` faz parte do carregamento do catálogo, apesar do nome histórico, e permanece no pacote. O recurso de referência `asura-appearance-source.json.gz` contém dados estáticos usados na compatibilidade; não é um perfil pessoal.
