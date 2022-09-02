import os, sys
import json
from glob import glob
import requests

# ENDPOINT = 'http://localhost:52773/vnx/task'
ENDPOINT = 'http://3.81.189.215:52773/vnx/task'

# Update the task with the given taskid with the given taskjson.
def updateTask(taskjson):
    r = requests.put(ENDPOINT+'/'+taskjson['taskid'], json=taskjson)
    if r.status_code == 200:
        return r.json()
    else:
        print (r.status_code)
        print (r.text)
        return False

# Extract taskid (optional) and type from taskjson and submit to server. 
# Return the server response.
def createTask(taskjson):
    newtask = {}
    if 'taskid' in taskjson:
        tid = taskjson['taskid']
        if len(tid) > 0:
            newtask['taskid'] = tid
    if 'type' in taskjson:
        newtask['type'] = taskjson['type']
    else:
        return False

    r = requests.post(ENDPOINT, json=newtask)
    if r.status_code == 200:
        print('Task creation response:')
        print(r.text)
        return r.json()
    else:
        print (r.status_code)
        print (r.text)
        return False

def main():
    args = sys.argv[1:]
    fs = args[0]
    if os.path.isdir(args[0]):
        fs = glob.glob(args[0]+'/*.json')
    else:
        fs = [args[0]]

    for file in fs:
        with open(file, 'r') as f:
            taskjson = json.load(f)

        newtask = createTask(taskjson)
        if newtask:
            taskjson['taskid'] = newtask['taskid']
            task = updateTask(taskjson)
            print (json.dumps(task, indent=4))
        else:
            print ('Failed to create task')

if __name__ == "__main__":
    main()
    sys.exit(0)
    
