import re

file_path = 'mobile/src/js/app.js'

with open(file_path, 'r') as f:
    content = f.read()

# Simplify generateHealthSummary HTML - Loading
simple_loading = 'container.innerHTML = "<div class=\\"processing-container\\">Generating summary...</div>";'
content = re.sub(r'container\.innerHTML = `[\s\S]*?`;', simple_loading, content, count=1)

# Simplify generateHealthSummary HTML - Success
simple_success = 'container.innerHTML = "<div class=\\"summary-text\\">" + response.summary + "</div><div style=\\"font-size:10px\\">Generated just now</div>";'
content = re.sub(r'container\.innerHTML = `[\s\S]*?response.summary[\s\S]*?`;', simple_success, content, count=1)

# Simplify generateHealthSummary HTML - Error
simple_error = 'container.innerHTML = "<div style=\\"text-align:center; color:red;\\">Failed to generate summary. <button class=\\"btn-secondary\\" onclick=\\"app.generateHealthSummary(this)\\">Try Again</button></div>";'
content = re.sub(r'container\.innerHTML = `[\s\S]*?Failed to generate[\s\S]*?`;', simple_error, content, count=1)

# Simplify renderVitalsPreview HTML - Main Card
simple_vitals = 'const vitalsHtml = "<div id=\\"vitals-preview-card\\" class=\\"card\\"><div class=\\"card-header\\"><h2>Vitals</h2></div><div class=\\"chart-container\\"><canvas id=\\"bpChart\\"></canvas></div><div class=\\"chart-container\\"><canvas id=\\"sugarChart\\"></canvas></div></div>";'
content = re.sub(r'const vitalsHtml = `[\s\S]*?`;', simple_vitals, content, count=1)

# Simplify renderVitalsPreview HTML - Empty States (BP)
simple_empty_bp = '.innerHTML = "<div class=\\"empty-state\\">No blood pressure data</div>";'
content = re.sub(r'\.innerHTML = `[\s\S]*?No blood pressure data[\s\S]*?`;', simple_empty_bp, content, count=1)

# Simplify renderVitalsPreview HTML - Empty States (Sugar)
simple_empty_sugar = '.innerHTML = "<div class=\\"empty-state\\">No sugar level data</div>";'
content = re.sub(r'\.innerHTML = `[\s\S]*?No sugar level data[\s\S]*?`;', simple_empty_sugar, content, count=1)


with open(file_path, 'w') as f:
    f.write(content)

print("Simplified ALL app.js HTML (including empty states)")
