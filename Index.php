<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Extractor Local</title>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js" defer></script>
    <script src="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js" defer></script>
    <script src="script.js" defer></script>
    <link rel="stylesheet" href="css.css">

</head>

<body>
    <div class="container">
        <div class="card">
            <header>
                <div>
                    <h1>Extractor</h1>
                </div>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap">
                    <div class="seg" role="group" aria-label="Tipo de informe">
                        <button class="segbtn" data-prof="manip" aria-pressed="true">Manipulador</button>
                        <button class="segbtn" data-prof="lhd" aria-pressed="false">LHD</button>
                        <button class="segbtn" data-prof="jumbo" aria-pressed="false">Jumbo</button>
                    </div>
                    <nav class="tabs" role="tablist">
                        <button class="tab" role="tab" aria-controls="view-upload" aria-selected="true">Cargar & Procesar</button>
                        <button class="tab" role="tab" aria-controls="view-results" aria-selected="false">Resultados</button>
                    </nav>
                </div>
            </header>

            <section id="view-upload" class="view active" role="tabpanel">
                <div class="row">
                    <label class="field" style="flex:1 1 320px">
                        <span>ZIPs con PDFs (puedes seleccionar varios)</span>
                        <input id="zipInput" type="file" multiple accept=".zip" />
                    </label>
                    <label class="field" style="width:180px">
                        <span>Debug</span>
                        <div style="display:flex; gap:8px; align-items:center"><input id="debugChk" type="checkbox" /> <span class="muted">mostrar log</span></div>
                    </label>
                </div>
                <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
                    <button id="btnProcess" class="primary">Procesar ZIP(s)</button>
                    <button id="btnClear" class="ghost">Limpiar tabla (perfil actual)</button>
                </div>
                <div id="debug" class="log" style="margin-top:14px; display:none"></div>
            </section>

            <section id="view-results" class="view" role="tabpanel">
                <div style="display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap">
                    <div class="muted">Primera columna = <strong>Usuario</strong> (carpeta raíz dentro del ZIP) · Perfil: <span id="profileLabel">Manipulador</span></div>
                    <div style="display:flex; gap:8px;">
                        <button id="btnCSV" class="ghost">Descargar CSV</button>
                    </div>
                </div>
                <div id="tableWrap"></div>
            </section>
        </div>
    </div>

</body>

</html>