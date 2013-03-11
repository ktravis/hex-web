import sys, os, time, re

def checkForUpdates(to_check, path="./"):
	before = dict([(f, os.stat(path+f).st_mtime) for f in to_check])
	while 1:
		time.sleep(2)
		after = dict([(f, os.stat(path+f).st_mtime) for f in to_check])
		updated = [f for f in after.keys() if not after[f] == before[f]]
		if updated: 
			print "Update: ", ", ".join(updated)
			combine(to_check)
			time.sleep(4)
		before = after
		
def combine(flist):
	combined = open("all.js", "w")
	for f in flist:
		if f == "all.js": continue
		cfile = open(f, 'r')
		combined.write('//'+f+' BEGIN\n')
		combined.write(cfile.read())
		combined.write('\n//'+f+' END\n\n\n')
		cfile.close()
	combined.close()
	print "all.js successfully updated!"

if len(sys.argv) > 1:
	path_to_watch = sys.argv[1].rstrip("/")+"/"
else:
	path_to_watch = "./"
	
	
if __name__ == "__main__":
	check = [f for f in os.listdir(path_to_watch) if (f != "all.js" and re.search("\.js$", f))]
	checkForUpdates(check,path_to_watch)
