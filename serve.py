import subprocess, SimpleHTTPServer, SocketServer, threading

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
subprocess.call(['chrome','localhost:'+`PORT`])
serve = threading.Thread(target=httpd.serve_forever)
serve.start()
subprocess.call(['python','updateCombine.py'])



