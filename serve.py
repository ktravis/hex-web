import subprocess, SimpleHTTPServer, SocketServer

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
subprocess.call(['chrome','localhost:'+`PORT`])
httpd.serve_forever()


