import schoolopy
import json
import webbrowser as wb
from datetime import datetime, tzinfo, timedelta, timezone
from dateutil import tz
# from django.utils import timezone
today = datetime.utcnow()+timedelta(hours=-5)
# today = today.astimezone(tz.tzlocal())
currentDay = (datetime.utcnow()+timedelta(hours=-5)).strftime("%Y-%m-%d")
date = (today - timedelta(days=today.weekday() + 1)).strftime("%Y-%m-%d")
dateCompare = datetime.strptime(date, "%Y-%m-%d")
nextSunday = today + timedelta(days=-today.weekday() - 1, weeks=1)
lastSunday = today - timedelta(days=today.weekday() + 1)
monday = today - timedelta(days=today.weekday() + 0)
tuesday = today - timedelta(days=today.weekday() - 1)
wednesday = today - timedelta(days=today.weekday() - 2)
thursday = today - timedelta(days=today.weekday() - 3)
friday = today - timedelta(days=today.weekday() - 4)
saturday = today - timedelta(days=today.weekday() - 5)
nextMonday = today - timedelta(days=today.weekday() - 7)

#https://app.sketchtogether.com/s/sketch/2YfnT.3.1/

from flask import Flask, render_template, jsonify, request

# Create a flask app
app = Flask(
  __name__,
  template_folder='templates',
  static_folder='static'
)

# Index page (now using the index.html file)
@app.route('/')
def index():
  weekDates = [lastSunday.strftime('%d'), monday.strftime('%d'), tuesday.strftime('%d'), wednesday.strftime('%d'), thursday.strftime('%d'), friday.strftime('%d'), saturday.strftime('%d'), nextSunday.strftime('%d'), nextMonday.strftime('%d')]
  weekDatesMonth = [lastSunday.strftime('%B %d'), monday.strftime('%B %d'), tuesday.strftime('%B %d'), wednesday.strftime('%B %d'), thursday.strftime('%B %d'), friday.strftime('%B %d'), saturday.strftime('%B %d'), nextSunday.strftime('%B %d'), nextMonday.strftime('%B %d')]
  weekMonths = ['Past', monday.strftime('%B'), tuesday.strftime('%B'), wednesday.strftime('%B'), thursday.strftime('%B'), friday.strftime('%B'), saturday.strftime('%B'), nextSunday.strftime('%B'), 'More']
  currentWeekday = datetime.strptime(currentDay, "%Y-%m-%d").weekday() + 1
  return render_template('index.html', weekDates=weekDates, weekDatesMonth=weekDatesMonth, currentWeekday=currentWeekday, weekMonths=weekMonths)

@app.route('/data', methods=["GET", "POST"])
def data():
  dataGet = json.loads(request.get_data())
  key = dataGet.split(" ")[0]
  secret = dataGet.split(" ")[1]
  
  sc = schoolopy.Schoology(schoolopy.Auth(key, secret))
  sc.limit = 200
  
  id = sc.get_me().uid

  # print(sc.get_event('5854192516', user_id=id))
  data = [[], [], [], [], [], [], [], []]
  dataClasses = [[], [], [], [], [], [], [], []]
  # current = today.astimezone(tz.tzlocal())
  events = sc.get_user_events(id)
  for event in events:
    eventDate = event.start[0:10]
    d = datetime.strptime(eventDate, "%Y-%m-%d")
    event.start = d.strftime('%B %d')
    if hasattr(event, 'section_id'):
      if d >= dateCompare and d <= nextSunday:
        data[d.weekday()].append(event)
        # dataClasses[d.weekday()].append(str(section.course_title))
        dataClasses[d.weekday()].append(sc._get('sections/' + str(event.section_id)))
      elif d >= dateCompare:
        data[7].append(event)
        # dataClasses[7].append(str(section.course_title))
        dataClasses[7].append(sc._get('sections/' + str(event.section_id)))
    else:
      if d >= dateCompare and d <= nextSunday:
        data[d.weekday()].append(event)
        # dataClasses[d.weekday()].append(str(section.course_title))
        dataClasses[d.weekday()].append(sc._get('groups/' + str(event.group_id)))
      elif d >= dateCompare:
        data[7].append(event)
        # dataClasses[7].append(str(section.course_title))
        dataClasses[7].append(sc._get('groups/' + str(event.group_id)))

  # return str(len(events))
  dataReply = [data, dataClasses]
  return json.dumps(dataReply)

@app.route('/dates', methods=["GET", "POST"])
def dates():
  dates = json.loads(request.get_data())

  dateReturn = []
  
  for date in dates:
    if datetime.strptime(date + " 2022", "%B %d %Y") < monday:
      dateReturn.append(0)
    elif datetime.strptime(date + " 2022", "%B %d %Y") > nextSunday:
      dateReturn.append(8)
    else:
      dateReturn.append(datetime.strptime(date + " 2022", "%B %d %Y").weekday() + 1)

  return json.dumps(dateReturn)

if __name__ == '__main__':
  # Run the Flask app
  app.run(
	host='0.0.0.0',
	debug=True,
	port=8080
  )