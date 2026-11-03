'use strict';
// Source strings are Portuguese; names, IDs and command tokens are never translated.
const rows = [
['Idioma','Language','Idioma'],
['Automático','Automatic','Automático'],
['Automático: {language}','Automatic: {language}','Automático: {language}'],
['Seus personagens. Seus perfis de aparência.','Your characters. Your appearance profiles.','Tus personajes. Tus perfiles de apariencia.'],
['Perfis de aparência','Appearance profiles','Perfiles de apariencia'],
['Catálogo de presets','Preset catalog','Catálogo de presets'],
['SEUS PRESETS NO CRIADOR','YOUR PRESETS IN THE CREATOR','TUS PRESETS EN EL CREADOR'],
['Carregando','Loading','Cargando'],
['Carregando…','Loading…','Cargando…'],
['Carregando perfis…','Loading profiles…','Cargando perfiles…'],
['Os perfis salvos entram no catálogo ao abrir o TERA. Escolha o visual em Customize → Presets.','Saved profiles enter the catalog when TERA opens. Choose a look in Customize → Presets.','Los perfiles guardados se cargan al abrir TERA. Elige tu apariencia en Customize → Presets.'],
['Seções','Sections','Secciones'],
['Perfis salvos','Saved profiles','Perfiles guardados'],
['Salvar perfil','Save profile','Guardar perfil'],
['Ajuda e comandos','Help and commands','Ayuda y comandos'],
['Gerenciar perfis e retratos','Manage profiles and portraits','Administrar perfiles y retratos'],
['Atualizar lista','Refresh list','Actualizar lista'],
['Escolha um perfil para consultar ou trocar o retrato','Choose a profile to view or change its portrait','Elige un perfil para verlo o cambiar su retrato'],
['Selecione um perfil salvo','Select a saved profile','Selecciona un perfil guardado'],
['Retrato do perfil','Profile portrait','Retrato del perfil'],
['Adicionar ou trocar retrato','Add or change portrait','Agregar o cambiar retrato'],
['Adicionar retrato','Add portrait','Agregar retrato'],
['Trocar retrato','Change portrait','Cambiar retrato'],
['Opcional · 64 × 64 pixels','Optional · 64 × 64 pixels','Opcional · 64 × 64 píxeles'],
['Todos os perfis salvos entram no catálogo ao abrir o TERA. Em','All saved profiles enter the catalog when TERA opens. In','Todos los perfiles guardados se cargan al abrir TERA. En'],
[', clique em Preset 1, 2 etc. ao lado do aleatório; passe o mouse para ver o nome. Só aparecem perfis da mesma raça e gênero. Para incluir perfis ou retratos novos no catálogo, reabra',', click Preset 1, 2, etc. beside the random button; hover to see the name. Only profiles of the same race and gender appear. To add new profiles or portraits to the catalog, reopen',', haz clic en Preset 1, 2, etc. junto al botón aleatorio; pasa el cursor para ver el nombre. Solo aparecen perfiles de la misma raza y género. Para agregar nuevos perfiles o retratos al catálogo, vuelve a abrir'],
['somente o TERA','only TERA','solo TERA'],
['com Toolbox iniciado.','with Toolbox running.','con Toolbox iniciado.'],
['Guardar uma aparência','Save an appearance','Guardar una apariencia'],
['Salva uma nova cópia com os dados de aparência. Reabra somente o TERA, mantendo o Toolbox iniciado, para o novo perfil aparecer em Customize → Presets.','Saves a new copy of the appearance data. Reopen only TERA, keeping Toolbox running, to see the new profile in Customize → Presets.','Guarda una nueva copia de los datos de apariencia. Vuelve a abrir solo TERA, con Toolbox iniciado, para ver el nuevo perfil en Customize → Presets.'],
['Personagem de origem','Source character','Personaje de origen'],
['Use self para seu personagem atual, ou informe um nome conhecido.','Use self for your current character, or enter a known name.','Usa self para tu personaje actual o escribe un nombre conocido.'],
['Nome do novo perfil','New profile name','Nombre del nuevo perfil'],
['opcional','optional','opcional'],
['Ex.: Meu visual de Castanic','E.g. My Castanic look','Ej.: Mi apariencia de Castanic'],
['Se deixar vazio, será usado o nome do personagem.','Leave blank to use the character name.','Déjalo vacío para usar el nombre del personaje.'],
['Retrato do novo perfil','New profile portrait','Retrato del nuevo perfil'],
['Escolher retrato opcional','Choose an optional portrait','Elegir retrato opcional'],
['Descartar retrato','Discard portrait','Descartar retrato'],
['Escolha ou cole uma captura feita ao salvar este personagem. Você enquadra o rosto; o ícone será salvo junto do novo perfil.','Choose or paste a screenshot taken when saving this character. Frame the face; the icon will be saved with the new profile.','Elige o pega una captura de este personaje. Encuadra el rostro; el ícono se guardará junto con el nuevo perfil.'],
['Salvar novo perfil','Save new profile','Guardar nuevo perfil'],
['Para salvar seu personagem, entre no mundo. Outro personagem precisa estar na lista de seleção recebida pelo mod ou visível no mapa.','Enter the world to save your character. Other characters must be in the selection list received by the mod or visible on the map.','Entra al mundo para guardar tu personaje. Otros personajes deben estar en la lista de selección recibida por el mod o visibles en el mapa.'],
['Presets salvos no criador','Saved presets in the creator','Presets guardados en el creador'],
['Salve os perfis desejados. Abra ou reabra somente o TERA, com Toolbox iniciado.','Save the profiles you want. Open or reopen only TERA with Toolbox running.','Guarda los perfiles que quieras. Abre o vuelve a abrir solo TERA con Toolbox iniciado.'],
['Escolha raça, gênero e classe normalmente. Entre em Customize e abra Presets.','Choose race, gender and class as usual. Enter Customize and open Presets.','Elige raza, género y clase como siempre. Entra a Customize y abre Presets.'],
['Clique nos presets salvos ao lado do aleatório. Aguarde a conclusão; depois pode ajustar ou trocar de preset.','Click a saved preset beside the random button. Wait until it finishes; then adjust or switch presets.','Haz clic en un preset guardado junto al botón aleatorio. Espera a que termine; después puedes ajustar o cambiar de preset.'],
['Não precisa ativar os perfis um por um. A lista do jogo é carregada por abertura, com até 64 perfis; perfis ou retratos novos entram ao reabrir somente o TERA. Consulte o nome passando o mouse sobre o preset.','There is no need to activate profiles individually. The game loads up to 64 profiles per launch; new profiles or portraits appear after reopening only TERA. Hover over a preset to see its name.','No necesitas activar los perfiles uno por uno. El juego carga hasta 64 perfiles al abrirse; los nuevos perfiles o retratos aparecen al volver a abrir solo TERA. Pasa el cursor sobre un preset para ver su nombre.'],
['Retratos dos presets','Preset portraits','Retratos de los presets'],
["Use o quadro do retrato ou o botão Adicionar retrato para importar uma captura PNG/JPEG ou colar um print. Clique no rosto, ajuste o quadrado e confira a prévia. Para perfis existentes, selecione o perfil; se já tiver imagem, use Trocar retrato. Reabra somente o TERA para os ícones aparecerem no criador. Perfis sem imagem continuam com o botão de texto. O retrato é uma imagem escolhida por você, inclusive para personagens próximos.","Use the portrait frame or Add portrait button to import a PNG/JPEG screenshot or paste an image. Click the face, adjust the square and check the preview. For existing profiles, select the profile; if it already has an image, use Change portrait. Reopen only TERA to see the icons in the creator. Profiles without an image keep a text button. You choose the portrait image, including for nearby characters.","Usa el recuadro del retrato o el botón Agregar retrato para importar una captura PNG/JPEG o pegar una imagen. Haz clic en el rostro, ajusta el cuadrado y revisa la vista previa. Para perfiles existentes, selecciona el perfil; si ya tiene una imagen, usa Cambiar retrato. Vuelve a abrir solo TERA para ver los íconos en el creador. Los perfiles sin imagen conservan un botón de texto. Tú eliges la imagen del retrato, incluso para personajes cercanos."],
['Comandos do catálogo','Catalog commands','Comandos del catálogo'],
['Comando no chat','Chat command','Comando en el chat'],
['Na janela','In the window','En la ventana'],
['Abre a janela dentro do jogo.','Opens the window in the game.','Abre la ventana dentro del juego.'],
['Abre esta janela. Também aceita','Opens this window. Also accepts','Abre esta ventana. También acepta'],
['Salvar perfil. Pode trocar self pelo nome de outro personagem.','Save a profile. Replace self with another character name if needed.','Guarda un perfil. Puedes cambiar self por el nombre de otro personaje.'],
['Consultar status.','Check status.','Consultar estado.'],
['Atualizar lista de arquivos salvos.','Refresh the list of saved files.','Actualizar la lista de archivos guardados.'],
['Antes do primeiro personagem','Before your first character','Antes de tu primer personaje'],
['Coloque os perfis JSON na pasta profiles do mod e abra Toolbox e TERA. Os presets compatíveis já aparecem em Customize → Presets; não precisa de comandos de preparação nem de editar o config.','Place the JSON profiles in the mod’s profiles folder and open Toolbox and TERA. Compatible presets appear in Customize → Presets; no preparation commands or config edits are needed.','Coloca los perfiles JSON en la carpeta profiles del mod y abre Toolbox y TERA. Los presets compatibles aparecen en Customize → Presets; no necesitas comandos de preparación ni editar el config.'],
['Nenhum preset é aplicado automaticamente. Escolha o visual em Customize → Presets.','No preset is applied automatically. Choose a look in Customize → Presets.','Ningún preset se aplica automáticamente. Elige tu apariencia en Customize → Presets.'],
['Resultado das ações','Action results','Resultados de las acciones'],
['Resultado e status','Results and status','Resultados y estado'],
['Consultar status','Check status','Consultar estado'],
['Aguardando dados do Toolbox…','Waiting for Toolbox data…','Esperando datos de Toolbox…'],
['Detalhes da sessão e últimas mensagens','Session details and recent messages','Detalles de la sesión y mensajes recientes'],
['Salve aqui. Escolha o preset em Customize → Presets.','Save here. Choose your preset in Customize → Presets.','Guarda aquí. Elige tu preset en Customize → Presets.'],
['Escolher imagem','Choose image','Elegir imagen'],
['Colar print','Paste screenshot','Pegar captura'],
['Clique ou arraste para enquadrar o rosto. Use as setas para ajuste fino.','Click or drag to frame the face. Use arrow keys for fine adjustments.','Haz clic o arrastra para encuadrar el rostro. Usa las flechas para ajustes finos.'],
['Prévia do ícone','Icon preview','Vista previa del ícono'],
['Tamanho do recorte','Crop size','Tamaño del recorte'],
['Nitidez suave','Gentle sharpening','Nitidez suave'],
['Desmarque para comparar a prévia.','Uncheck to compare the preview.','Desmarca para comparar la vista previa.'],
['Prefira uma captura com o rosto próximo e enquadre sem muito fundo.','Use a close-up of the face and avoid too much background.','Usa una captura con el rostro de cerca y evita incluir mucho fondo.'],
['Arraste o quadrado ou use as setas. A prévia de 64 × 64 mostra exatamente o ícone salvo.','Drag the square or use arrow keys. The 64 × 64 preview shows the exact saved icon.','Arrastra el cuadrado o usa las flechas. La vista previa de 64 × 64 muestra el ícono que se guardará.'],
['Usar este recorte','Use this crop','Usar este recorte'],
['Cancelar','Cancel','Cancelar'],
['Executando…','Working…','Procesando…'],
['Origem: {source} · {race}, {gender}','Source: {source} · {race}, {gender}','Origen: {source} · {race}, {gender}'],
['Salve um perfil na outra aba ou atualize a lista.','Save a profile in the other tab or refresh the list.','Guarda un perfil en la otra pestaña o actualiza la lista.'],
['{count} perfil salvo','{count} saved profile','{count} perfil guardado'],
['{count} perfis salvos','{count} saved profiles','{count} perfiles guardados'],
['Salve seu primeiro perfil','Save your first profile','Guarda tu primer perfil'],
['Catálogo','Catalog','Catálogo'],
['Vazio','Empty','Vacío'],
['Pronto. Escolha uma ação na janela.','Ready. Choose an action in the window.','Listo. Elige una acción en la ventana.'],
['self = {name}. Também aceita um personagem da seleção recebida ou visível no mapa.','self = {name}. Also accepts a character in the received selection list or visible on the map.','self = {name}. También acepta un personaje de la lista de selección recibida o visible en el mapa.'],
['Entre no mundo para usar self. Outro nome precisa estar na seleção recebida ou visível no mapa.','Enter the world to use self. Other names must be in the received selection list or visible on the map.','Entra al mundo para usar self. Otros nombres deben estar en la lista de selección recibida o visibles en el mapa.'],
['Retrato: {name}','Portrait: {name}','Retrato: {name}'],
['Escolha PNG ou JPEG de até 16 MB.','Choose a PNG or JPEG up to 16 MB.','Elige una imagen PNG o JPEG de hasta 16 MB.'],
['Não foi possível abrir a imagem.','Could not open the image.','No se pudo abrir la imagen.'],
['Não foi possível ler a imagem.','Could not read the image.','No se pudo leer la imagen.'],
['Clique no rosto e ajuste o tamanho do quadrado. Confira a prévia antes de confirmar.','Click the face and adjust the square size. Check the preview before confirming.','Haz clic en el rostro y ajusta el tamaño del cuadrado. Revisa la vista previa antes de confirmar.'],
['Copie uma captura como imagem antes de colar.','Copy a screenshot as an image before pasting.','Copia una captura como imagen antes de pegarla.'],
['Tire uma captura ao salvar o personagem. Escolha o arquivo ou cole o print, depois enquadre o rosto.','Take a screenshot when saving the character. Choose the file or paste the image, then frame the face.','Toma una captura al guardar el personaje. Elige el archivo o pega la imagen y luego encuadra el rostro.'],
['Humana','Human','Humano'],['Elfa alta','High Elf','Elfo alto'],['feminino','female','femenino'],['masculino','male','masculino'],['raça {race}','race {race}','raza {race}'],['Origem desconhecida','Unknown source','Origen desconocido'],
['Looks Profile: idioma salvo.','Looks Profile: language saved.','Looks Profile: idioma guardado.'],
['Idioma inválido. Use auto, pt, en ou es.','Invalid language. Use auto, pt, en or es.','Idioma no válido. Usa auto, pt, en o es.'],
['Looks Profile: perfil padrão e preparação foram removidos. Escolha um preset em Customize → Presets.','Looks Profile: default profiles and preparation were removed. Choose a preset in Customize → Presets.','Looks Profile: se eliminaron el perfil predeterminado y la preparación. Elige un preset en Customize → Presets.'],
['Looks Profile: não existe mais perfil padrão ou aplicação automática. Seus presets continuam no criador.','Looks Profile: there is no default profile or automatic application. Your presets remain in the creator.','Looks Profile: ya no hay un perfil predeterminado ni aplicación automática. Tus presets siguen en el creador.'],
['Looks Profile: {count} perfil(is) completo(s) carregado(s).','Looks Profile: {count} complete profile(s) loaded.','Looks Profile: {count} perfil(es) completo(s) cargado(s).'],
['Uso: /8 lookprofile [save <personagem|self> [nome do perfil] | status | reload | gui]','Usage: /8 lookprofile [save <character|self> [profile name] | status | reload | gui]','Uso: /8 lookprofile [save <personaje|self> [nombre del perfil] | status | reload | gui]'],
['Perfil padrão e preparação foram removidos. Escolha o preset no criador.','Default profiles and preparation were removed. Choose the preset in the creator.','Se eliminaron el perfil predeterminado y la preparación. Elige el preset en el creador.'],
['Use até 100 caracteres por campo.','Use up to 100 characters per field.','Usa hasta 100 caracteres por campo.'],
['Selecione um perfil salvo válido.','Select a valid saved profile.','Selecciona un perfil guardado válido.'],
['Ação da janela não reconhecida.','Unrecognized window action.','Acción de la ventana no reconocida.'],
['Looks Profile: retrato salvo. Reabra somente o TERA para atualizar o ícone no criador.','Looks Profile: portrait saved. Reopen only TERA to update the creator icon.','Looks Profile: retrato guardado. Vuelve a abrir solo TERA para actualizar el ícono en el creador.'],
['Looks Profile: abra o TERA Toolbox em modo gráfico para usar a janela de perfis.','Looks Profile: run TERA Toolbox in GUI mode to use the profile window.','Looks Profile: inicia TERA Toolbox en modo gráfico para usar la ventana de perfiles.'],
['Dados do seu personagem ainda não chegaram. Entre no mundo uma vez ou salve um personagem da seleção.','Your character data has not arrived yet. Enter the world once or save a character from the selection screen.','Todavía no llegaron los datos de tu personaje. Entra al mundo una vez o guarda un personaje de la selección.'],
['Não encontrei “{name}”. Use self, um personagem da seleção ou alguém que esteja visível no mapa.','Could not find “{name}”. Use self, a character from the selection screen or someone visible on the map.','No encontré a “{name}”. Usa self, un personaje de la selección o alguien visible en el mapa.'],
['Looks Profile: {error}','Looks Profile: {error}','Looks Profile: {error}'],
['Looks Profile: perfil não salvo. {error}','Looks Profile: profile not saved. {error}','Looks Profile: no se guardó el perfil. {error}'],
['Looks Profile: aparência salva, mas o retrato não foi gravado: {error}','Looks Profile: appearance saved, but the portrait was not saved: {error}','Looks Profile: se guardó la apariencia, pero no el retrato: {error}'],
['Looks Profile: erro ao salvar o perfil: {error}','Looks Profile: failed to save the profile: {error}','Looks Profile: error al guardar el perfil: {error}'],
['Looks Profile: “{name}” salvo com aparência, details e shape completos. Origem: {source}. Reabra somente o TERA, mantendo o Toolbox iniciado, e escolha este perfil em Customize → Presets.','Looks Profile: “{name}” saved with complete appearance, details and shape. Source: {source}. Reopen only TERA, keeping Toolbox running, and choose this profile in Customize → Presets.','Looks Profile: “{name}” guardado con apariencia, details y shape completos. Origen: {source}. Vuelve a abrir solo TERA, con Toolbox iniciado, y elige este perfil en Customize → Presets.'],
['Looks Profile {version}: {count} perfil(is) salvo(s). Nenhum perfil padrão ou aplicação automática. Escolha um preset em Customize → Presets.','Looks Profile {version}: {count} saved profile(s). No default profile or automatic application. Choose a preset in Customize → Presets.','Looks Profile {version}: {count} perfil(es) guardado(s). Sin perfil predeterminado ni aplicación automática. Elige un preset en Customize → Presets.'],
['Looks Profile: status indisponível: {error}','Looks Profile: status unavailable: {error}','Looks Profile: estado no disponible: {error}'],
['Catálogo disponível na próxima abertura do TERA. Nenhuma aplicação automática.','Catalog available on the next TERA launch. No automatic application.','Catálogo disponible al volver a abrir TERA. Sin aplicación automática.'],
['Esta abertura ainda usa uma interface antiga. Reabra o TERA para retirar a aplicação automática.','This session still uses an old interface. Reopen TERA to remove automatic application.','Esta sesión todavía usa una interfaz anterior. Vuelve a abrir TERA para eliminar la aplicación automática.'],
['Catálogo registrado: {count} perfis. Nenhuma aplicação automática. Escolha em Customize → Presets.','Catalog registered: {count} profiles. No automatic application. Choose in Customize → Presets.','Catálogo registrado: {count} perfiles. Sin aplicación automática. Elige en Customize → Presets.'],
['Falha no registro: {error}. Reabra somente o TERA antes de tentar novamente.','Registration failed: {error}. Reopen only TERA before trying again.','Error al registrar: {error}. Vuelve a abrir solo TERA antes de intentar de nuevo.'],
['Catálogo não instalado: {error}.','Catalog not installed: {error}.','Catálogo no instalado: {error}.'],
['empty-catalog','No valid profiles','No hay perfiles válidos'],
['O nome do perfil deve ter de 1 a 48 caracteres.','The profile name must contain 1 to 48 characters.','El nombre del perfil debe tener entre 1 y 48 caracteres.'],
['Dados do personagem não encontrados.','Character data not found.','No se encontraron los datos del personaje.'],
['Aparência básica não disponível.','Basic appearance is unavailable.','La apariencia básica no está disponible.'],
['Formato de perfil desconhecido.','Unknown profile format.','Formato de perfil desconocido.'],
['O campo appearance2 não está disponível.','The appearance2 field is unavailable.','El campo appearance2 no está disponible.'],
['Dimensões de imagem inválidas.','Invalid image dimensions.','Dimensiones de imagen no válidas.']
];
rows.push(...[
  [
    "Imagem excede o limite de 24 megapixels ou 8192 pixels por lado.",
    "Image exceeds 24 megapixels or 8192 pixels per side.",
    "La imagen supera los 24 megapíxeles u 8192 píxeles por lado."
  ],
  [
    "Tamanho de recorte inválido.",
    "Invalid crop size.",
    "Tamaño de recorte no válido."
  ],
  [
    "Posição de recorte inválida.",
    "Invalid crop position.",
    "Posición de recorte no válida."
  ],
  [
    "Área de imagem inválida.",
    "Invalid image area.",
    "Área de imagen no válida."
  ],
  [
    "ID de perfil inválido.",
    "Invalid profile ID.",
    "ID de perfil no válido."
  ],
  [
    "Ícone PNG inválido.",
    "Invalid PNG icon.",
    "Ícono PNG no válido."
  ],
  [
    "PNG truncado.",
    "Truncated PNG.",
    "PNG truncado."
  ],
  [
    "PNG corrompido.",
    "Corrupted PNG.",
    "PNG dañado."
  ],
  [
    "Cabeçalho PNG ausente.",
    "Missing PNG header.",
    "Falta el encabezado PNG."
  ],
  [
    "Use PNG RGB/RGBA de 64 × 64.",
    "Use a 64 × 64 RGB/RGBA PNG.",
    "Usa un PNG RGB/RGBA de 64 × 64."
  ],
  [
    "Final PNG inválido.",
    "Invalid PNG ending.",
    "Final de PNG no válido."
  ],
  [
    "Formato PNG não suportado.",
    "Unsupported PNG format.",
    "Formato PNG no compatible."
  ],
  [
    "PNG incompleto.",
    "Incomplete PNG.",
    "PNG incompleto."
  ],
  [
    "Pixels PNG inválidos.",
    "Invalid PNG pixels.",
    "Píxeles PNG no válidos."
  ],
  [
    "Filtro PNG inválido.",
    "Invalid PNG filter.",
    "Filtro PNG no válido."
  ],
  [
    "Pasta de ícones inválida.",
    "Invalid icon folder.",
    "Carpeta de íconos no válida."
  ],
  [
    "Arquivo de ícone inválido.",
    "Invalid icon file.",
    "Archivo de ícono no válido."
  ],
  [
    "Ícone excede o limite.",
    "Icon exceeds the limit.",
    "El ícono supera el límite."
  ],
  [
    "Recorte de ícone inválido.",
    "Invalid icon crop.",
    "Recorte de ícono no válido."
  ],
  [
    "Use um recorte de 64 × 64.",
    "Use a 64 × 64 crop.",
    "Usa un recorte de 64 × 64."
  ],
  [
    "config.json excede o limite.",
    "config.json exceeds the limit.",
    "config.json supera el límite."
  ],
  [
    "config.json precisa ter um objeto data válido.",
    "config.json must contain a valid data object.",
    "config.json debe contener un objeto data válido."
  ],
  [
    "templateId fora da faixa conhecida.",
    "templateId is outside the known range.",
    "templateId está fuera del rango conocido."
  ],
  [
    "Nome do perfil ausente.",
    "Missing profile name.",
    "Falta el nombre del perfil."
  ],
  [
    "{field} inválido.",
    "Invalid {field}.",
    "{field} no válido."
  ],
  [
    "{field} não está disponível como bytes.",
    "{field} is unavailable as bytes.",
    "{field} no está disponible como bytes."
  ],
  [
    "{field} tem tamanho inesperado ({count}).",
    "{field} has an unexpected size ({count}).",
    "{field} tiene un tamaño inesperado ({count})."
  ],
  [
    "{field} contém um byte inválido.",
    "{field} contains an invalid byte.",
    "{field} contiene un byte no válido."
  ],
  [
    "Perfil não salvo: details tem {count} bytes; eram esperados {expected}.",
    "Profile not saved: details contains {count} bytes; expected {expected}.",
    "No se guardó el perfil: details tiene {count} bytes; se esperaban {expected}."
  ],
  [
    "details deve conter {count} bytes.",
    "details must contain {count} bytes.",
    "details debe tener {count} bytes."
  ],
  [
    "gênero",
    "gender",
    "género"
  ],
  [
    "classe",
    "class",
    "clase"
  ],
  [
    "raça",
    "race",
    "raza"
  ]
]);
rows.push(...[["/8 lookprofile save self Nome","/8 lookprofile save self Name","/8 lookprofile save self Nombre"],["A pasta de cache deve ser uma pasta local do mod.","The cache folder must be a local mod folder.","La carpeta de caché debe ser una carpeta local del mod."],["Identificacao invalida para o cache do cliente.","Invalid client cache identification.","Identificación de caché del cliente no válida."],["Campo de aparencia invalido.","Invalid appearance field.","Campo de apariencia no válido."],["Tamanho de perfil invalido.","Invalid profile size.","Tamaño de perfil no válido."],["Nome excede 48 caracteres.","Name exceeds 48 characters.","El nombre supera los 48 caracteres."],["Catalogo excede o limite de perfis.","Catalog exceeds the profile limit.","El catálogo supera el límite de perfiles."],["Nome de perfil invalido.","Invalid profile name.","Nombre de perfil no válido."],["Catalogo excede a reserva da interface.","Catalog exceeds the reserved interface space.","El catálogo supera el espacio reservado de la interfaz."],["Reserva do catalogo nao corresponde a interface verificada.","Catalog space does not match the verified interface.","El espacio del catálogo no coincide con la interfaz verificada."],["Catalogo excede {count} perfis. Nenhum perfil foi apagado.","Catalog exceeds {count} profiles. No profile was deleted.","El catálogo supera los {count} perfiles. No se eliminó ningún perfil."],["Arquivo de controle excede o limite.","Control file exceeds the limit.","El archivo de control supera el límite."],["O Toolbox não informou a pasta do cliente.","Toolbox did not provide the client folder.","Toolbox no indicó la carpeta del cliente."],["O pacote compactado nao corresponde ao arquivo verificado.","The compressed package does not match the verified file.","El paquete comprimido no coincide con el archivo verificado."],["O pacote compactado foi alterado.","The compressed package was modified.","Se modificó el paquete comprimido."],["O pacote descompactado nao corresponde a interface verificada.","The decompressed package does not match the verified interface.","El paquete descomprimido no coincide con la interfaz verificada."],["Este teste exige o cliente x64 100.2 que foi analisado.","This interface requires the verified x64 100.2 client.","Esta interfaz requiere el cliente x64 100.2 verificado."],["Contêiner de interface incompatível.","Incompatible interface container.","Contenedor de interfaz no compatible."],["Leitura incompleta do recurso original.","Incomplete read of the original resource.","Lectura incompleta del recurso original."],["A interface deste cliente difere da versão analisada.","This client interface differs from the verified version.","La interfaz de este cliente difiere de la versión verificada."]]);
rows.push(...[["Escolha um perfil para gerenciar","Choose a profile to manage","Elige un perfil para administrar"],["Atualizar com meu personagem","Update from my character","Actualizar con mi personaje"],["Excluir perfil","Delete profile","Eliminar perfil"],["Atualizar perfil","Update profile","Actualizar perfil"],["Atualizar perfil?","Update profile?","¿Actualizar perfil?"],["Excluir perfil?","Delete profile?","¿Eliminar perfil?"],["Confirmar","Confirm","Confirmar"],["Atualizar substitui a aparência pela do personagem conectado e mantém o nome e o retrato. Excluir remove o perfil e seu retrato.","Updating replaces the appearance with that of your logged-in character and keeps the name and portrait. Deleting removes the profile and its portrait.","Actualizar reemplaza la apariencia por la del personaje conectado y conserva el nombre y el retrato. Eliminar borra el perfil y su retrato."],["Após atualizar ou excluir, reabra somente o TERA para atualizar o catálogo do criador.","After updating or deleting, reopen only TERA to refresh the creator catalog.","Después de actualizar o eliminar, vuelve a abrir solo TERA para actualizar el catálogo del creador."],["Esta ação não altera nem exclui seu personagem no jogo.","This action does not change or delete your in-game character.","Esta acción no modifica ni elimina tu personaje del juego."],["Substituir a aparência de “{name}” pela de {source} ({race}, {gender})? O nome e o retrato serão mantidos. A aparência anterior será substituída.","Replace the appearance of “{name}” with that of {source} ({race}, {gender})? The name and portrait will be kept. The previous appearance will be overwritten.","¿Reemplazar la apariencia de “{name}” por la de {source} ({race}, {gender})? Se conservarán el nombre y el retrato. Se sobrescribirá la apariencia anterior."],["Excluir “{name}” e seu retrato? Essa exclusão não pode ser desfeita pela janela.","Delete “{name}” and its portrait? This deletion cannot be undone from this window.","¿Eliminar “{name}” y su retrato? No puedes deshacer esta eliminación desde la ventana."],["Entre no mundo com o personagem que deseja salvar.","Enter the world with the character you want to save.","Entra al mundo con el personaje que deseas guardar."],["Confirmação expirada. Escolha o perfil novamente.","Confirmation expired. Select the profile again.","La confirmación expiró. Selecciona el perfil de nuevo."],["O personagem mudou ou saiu do mundo. Tente novamente.","The character changed or left the world. Try again.","El personaje cambió o salió del mundo. Inténtalo de nuevo."],["Caminho de perfil ou retrato inválido.","Invalid profile or portrait path.","Ruta de perfil o retrato no válida."],["O perfil não está mais disponível. Atualize a lista.","The profile is no longer available. Refresh the list.","El perfil ya no está disponible. Actualiza la lista."],["Arquivo de perfil ou retrato excede o limite.","The profile or portrait file exceeds the limit.","El archivo de perfil o retrato supera el límite."],["O perfil ou retrato mudou. Confira a lista e tente novamente.","The profile or portrait changed. Check the list and try again.","El perfil o retrato cambió. Revisa la lista e inténtalo de nuevo."],["Looks Profile: perfil atualizado. Nome e retrato mantidos. Reabra somente o TERA para atualizar o catálogo.","Looks Profile: profile updated. Name and portrait preserved. Reopen only TERA to refresh the catalog.","Looks Profile: perfil actualizado. Nombre y retrato conservados. Vuelve a abrir solo TERA para actualizar el catálogo."],["Looks Profile: perfil excluído do catálogo local. Reabra somente o TERA para atualizar o criador.","Looks Profile: profile deleted from the local catalog. Reopen only TERA to refresh the creator.","Looks Profile: perfil eliminado del catálogo local. Vuelve a abrir solo TERA para actualizar el creador."],["Looks Profile: restaram arquivos temporários da exclusão. Confira a pasta do mod antes de considerar a remoção completa.","Looks Profile: temporary deletion files remain. Check the mod folder before considering removal complete.","Looks Profile: quedan archivos temporales de la eliminación. Revisa la carpeta del mod antes de considerar completa la eliminación."]]);
rows.push(...[["Escolha um perfil salvo para ver seu retrato, atualizar a aparência ou excluir.","Choose a saved profile to view its portrait, update its appearance or delete it.","Elige un perfil guardado para ver su retrato, actualizar su apariencia o eliminarlo."],["Escolha um perfil na lista abaixo para adicionar ou trocar o retrato.","Choose a profile from the list below to add or change its portrait.","Elige un perfil de la lista de abajo para agregar o cambiar su retrato."],["O retrato será usado no botão deste preset no criador.","The portrait will appear on this preset’s button in the creator.","El retrato aparecerá en el botón de este preset en el creador."],["Atualizar aparência salva","Update saved appearance","Actualizar apariencia guardada"],["Entre no mundo com o personagem que deseja usar na atualização.","Enter the world with the character whose appearance you want to use.","Entra al mundo con el personaje cuya apariencia quieres usar."],["Será usada a aparência de {name}. O nome e o retrato do perfil serão mantidos.","The appearance of {name} will be used. The profile name and portrait will be kept.","Se usará la apariencia de {name}. Se conservarán el nombre y el retrato del perfil."],["Remover do catálogo","Remove from catalog","Eliminar del catálogo"],["Exclui o perfil escolhido e seu retrato após sua confirmação.","Deletes the chosen profile and its portrait after you confirm.","Elimina el perfil elegido y su retrato después de tu confirmación."],["Crie um perfil novo com a aparência de um personagem. O retrato é opcional.","Create a new profile from a character’s appearance. The portrait is optional.","Crea un perfil nuevo con la apariencia de un personaje. El retrato es opcional."],["Use uma imagem do computador ou cole uma captura da tela. Depois enquadre o rosto.","Choose an image from your computer or paste a screenshot. Then frame the face.","Elige una imagen de tu computadora o pega una captura de pantalla. Después encuadra el rostro."],["A imagem vira o ícone do preset. A aparência é copiada do personagem escolhido abaixo.","The image becomes the preset icon. The appearance is copied from the character selected below.","La imagen será el ícono del preset. La apariencia se copia del personaje elegido abajo."],["De qual personagem você quer salvar a aparência?","Whose appearance do you want to save?","¿De qué personaje quieres guardar la apariencia?"],["Meu personagem","My character","Mi personaje"],["Outro personagem pelo nome","Another character by name","Otro personaje por nombre"],["Será salva a aparência de {name}.","The appearance of {name} will be saved.","Se guardará la apariencia de {name}."],["Entre no mundo com o personagem que deseja salvar.","Enter the world with the character you want to save.","Entra al mundo con el personaje que deseas guardar."],["Nome do personagem","Character name","Nombre del personaje"],["Digite o nome exato do personagem","Enter the exact character name","Escribe el nombre exacto del personaje"],["Pode ser outro personagem seu na seleção ou um jogador visível no mapa. Digite o nome exato ou escolha uma sugestão.","Use another of your characters from character selection, or a player visible on the map. Enter the exact name or choose a suggestion.","Puede ser otro de tus personajes de la selección o un jugador visible en el mapa. Escribe el nombre exacto o elige una sugerencia."],["Para substituir um perfil existente, use Atualizar com meu personagem na aba Perfis salvos.","To replace an existing profile, use Update from my character in the Saved profiles tab.","Para reemplazar un perfil existente, usa Actualizar con mi personaje en la pestaña Perfiles guardados."],["Depois de salvar, reabra somente o TERA com Toolbox iniciado. O novo perfil aparecerá em Customize → Presets, para a mesma raça e gênero.","After saving, reopen only TERA with Toolbox running. The new profile will appear in Customize → Presets for the same race and gender.","Después de guardar, vuelve a abrir solo TERA con Toolbox iniciado. El perfil nuevo aparecerá en Customize → Presets para la misma raza y género."],["Escolher imagem do computador","Choose image from computer","Elegir imagen de la computadora"],["Colar captura da tela","Paste screenshot","Pegar captura de pantalla"],["Escolha uma imagem PNG/JPEG do computador ou copie uma captura e use Colar captura da tela. Depois enquadre o rosto e confirme o recorte.","Choose a PNG/JPEG image from your computer, or copy a screenshot and use Paste screenshot. Then frame the face and confirm the crop.","Elige una imagen PNG/JPEG de tu computadora, o copia una captura y usa Pegar captura de pantalla. Después encuadra el rostro y confirma el recorte."]]);
rows.push(...[["Mostrar lista de personagens","Show character list","Mostrar lista de personajes"],["Fechar lista de personagens","Close character list","Cerrar lista de personajes"],["Personagens disponíveis","Available characters","Personajes disponibles"],["Nenhum nome na lista. Você ainda pode digitar o nome completo.","No names in the list. You can still enter the full name.","No hay nombres en la lista. Aún puedes escribir el nombre completo."]]);
const strings=Object.create(null);
for(const [pt,en,es] of rows)strings[pt]={pt,en,es};
const names={pt:'Português',en:'English',es:'Español (Latinoamérica)'};
function normalize(value){if(typeof value!=='string')return null;const code=value.trim().toLowerCase().replace(/_/g,'-').split('-')[0];return ['pt','en','es'].includes(code)?code:null;}
function preference(value){return value==='auto'?'auto':normalize(value)||'auto';}
function resolve(mod){
  const chosen=preference(mod.settings&&mod.settings.language);if(chosen!=='auto')return chosen;
  // Electron exposes the OS locale without launching a shell, unlike the guide core.
  if(global.TeraProxy&&global.TeraProxy.GUIMode){try{const {app}=require('electron');if(app&&app.isReady()){const locale=normalize(app.getLocale());if(locale)return locale;}}catch(_){} }
  try{const locale=normalize(Intl.DateTimeFormat().resolvedOptions().locale);if(locale)return locale;}catch(_){}
  const client=mod.game&&mod.game.language;return normalize(client)||'en';
}
function t(language,text,params={}){
  const code=normalize(language)||'en',entry=strings[text],template=entry?entry[code]:String(text);
  return template.replace(/\{(\w+)\}/g,(token,key)=>Object.prototype.hasOwnProperty.call(params,key)?(key==='error'?error(code,params[key]):String(params[key])):token);
}
function error(language,text){
  if(text && typeof text==='object' && typeof text.text==='string')return t(language,text.text,text.params);
  if(strings[text])return t(language,text);
  const catalogOverflow=String(text).match(/^Catalogo excede (\d+) perfis\. Nenhum perfil foi apagado\.$/);if(catalogOverflow)return t(language,'Catalogo excede {count} perfis. Nenhum perfil foi apagado.',{count:catalogOverflow[1]});
  const patterns=[[/^(.+) inválido\.$/,'{field} inválido.',['field']],[/^(.+) não está disponível como bytes\.$/,'{field} não está disponível como bytes.',['field']],[/^(.+) tem tamanho inesperado \((\d+)\)\.$/,'{field} tem tamanho inesperado ({count}).',['field','count']],[/^(.+) contém um byte inválido\.$/,'{field} contém um byte inválido.',['field']],[/^Perfil não salvo: details tem (\d+) bytes; eram esperados (\d+)\.$/,'Perfil não salvo: details tem {count} bytes; eram esperados {expected}.',['count','expected']],[/^details deve conter (\d+) bytes\.$/,'details deve conter {count} bytes.',['count']]];
  for(const [regex,key,fields]of patterns){const match=String(text).match(regex);if(match){const params={};fields.forEach((name,i)=>{params[name]=name==='field'?t(language,match[i+1]).replace(/^aparência\./,'appearance.'):match[i+1];});return t(language,key,params);}}
  return String(text);
}
module.exports={strings,names,normalize,preference,resolve,t,error};
