"""To generate new subtitle files with adjusted timestamps for cropped clips
Example:
	python crop_subtitles.py friends.s02e12.720p.bluray.x264-psychd.srt 00:02:42 00:00:13 clip_two.srt
Output:
	start_time: 0:02:42
	endtime: 0:02:55
	length: 0:00:13
	subtitle file processed! total dialogues: 5
	output file name: clip_two.srt
"""

import argparse
from datetime import timedelta
import sys
import time

START_TIME = ''
END_TIME = ''
LENGTH = ''

def extractTime(t):
	t = t.split(':')
	if (len(t) == 3):
		h = int(t[0].strip())
		m = int(t[1].strip())
		s = int(t[2].strip())
		return timedelta(hours=h, minutes=m, seconds=s)
	else:
		print("could not extract time t =", t)
		exit()

# assuming that t.hours < 10
def timeToStr(t):
	return '0'+str(t)

def subtractStart(line):
	tmp = line.split('-->')
	left = tmp[0]
	right = tmp[1]
	tmp = left.split(',')
	left = (tmp[0], tmp[1])
	tmp = right.split(',')
	right = (tmp[0], tmp[1])
	t1 = timeToStr( extractTime(left[0]) - START_TIME )
	t1 = t1 + ',' + left[1]
	t2 = timeToStr( extractTime(right[0]) - START_TIME )
	t2 = t2 + ',' + right[1]
	new_line = t1 + ' --> ' + t2
	return new_line

def printWaiting():
	sys.stdout.write('.')
	sys.stdout.flush()

# FIXME: assuming that dialogue's endtime is not bigger than END_TIME
#			(clip is not cut while a dialogue is going on)
def checkInRange(line):
	t = line.split('-->')[0]
	t = t.split(',')[0]
	t = extractTime(t)
	if ((t > START_TIME and (t < END_TIME)) or t == START_TIME):
		return (True, subtractStart(line))
	return (False, None)

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
	parser.add_argument("old_sfile", type=str, help="original subtitile file (.srt extension)")
	parser.add_argument("start_time", type=str, help="original start time of the cropped clip")
	parser.add_argument("cropped_len", type=str, help="length of the cropped clip")
	parser.add_argument("new_sfile", type=str, help="name of the newly created subtitle file (.srt)")
	args = parser.parse_args()

	START_TIME = extractTime(args.start_time)
	LENGTH = extractTime(args.cropped_len)
	END_TIME = START_TIME + LENGTH

	print("start_time:", START_TIME)
	print("endtime:", END_TIME)
	print("length:", LENGTH)

	print("Processing file...")

	# just so any previous file's data is erased
	new_sfile = open(args.new_sfile, 'w')
	new_sfile.close()

	with open(args.old_sfile, 'r') as old_sfile:
		count = 1
		new_lines = []
		inside_switch = False
		for line in old_sfile:	
			if inside_switch:
				if line.strip() == '':
					inside_switch = False
					with open(args.new_sfile, 'a') as new_sfile:
						for l in new_lines:
							new_sfile.write(l)
						new_sfile.write('\n')
					# for l in new_lines:
					# 	print(l)
					new_lines = []
				else:
					new_lines.append(line)
				continue
			if '-->' in line:
				assert not inside_switch, "error inside_switch should be off"
				inside, adjusted_line = checkInRange(line)
				if (inside):
					inside_switch = True
					assert len(new_lines) == 0, "problem expecting empty new_lines[]"
					new_lines.append(str(count)+'\n')
					new_lines.append(adjusted_line)
					count += 1
		print("subtitle file processed! \ntotal dialogues:", count)
		print("output file name:", args.new_sfile)




















