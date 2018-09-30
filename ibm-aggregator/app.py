from flask import Flask       
import tweepy 
import json
import csv 
import requests 
import xml.etree.ElementTree as ET
import re

TAG_RE = re.compile(r'<[^>]+>')
consumer_key = "OiUBzU60VTDqGEbj2wZZxkexw" 
consumer_secret = "xt6YteNBSlAnKdLq1rPsZPLXGWVjttON2dQ1PsoJhsthFSyaBa"
access_key = "552739862-6ZXsVyZxzEhuZvmQ1rr5JddnVt9RUm5NQJQOnpG4"
access_secret = "WM9M6pas93UBZIgyGhnZuzRUt1Kc1b5X1v1ETZlxoPXvE"

medium_text=[]
medium_time=[]
tweets_text=[]
tweets_time=[]
tweets_language=[]
instagram_text=[]
instagram_likes=[]
instagram_displayurl=[]

  
def get_tweets(username): 
          
        
        langs = {'ar': 'Arabic', 'bg': 'Bulgarian', 'ca': 'Catalan', 'cs': 'Czech', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English', 'es': 'Spanish', 'et': 'Estonian',
         'fa': 'Persian', 'fi': 'Finnish', 'fr': 'French', 'hi': 'Hindi', 'hr': 'Croatian', 'hu': 'Hungarian', 'id': 'Indonesian', 'is': 'Icelandic', 'it': 'Italian', 'iw': 'Hebrew',
         'ja': 'Japanese', 'ko': 'Korean', 'lt': 'Lithuanian', 'lv': 'Latvian', 'ms': 'Malay', 'nl': 'Dutch', 'no': 'Norwegian', 'pl': 'Polish', 'pt': 'Portuguese', 'ro': 'Romanian',
         'ru': 'Russian', 'sk': 'Slovak', 'sl': 'Slovenian', 'sr': 'Serbian', 'sv': 'Swedish', 'th': 'Thai', 'tl': 'Filipino', 'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu',
         'vi': 'Vietnamese', 'zh_CN': 'Chinese (simplified)', 'zh_TW': 'Chinese (traditional)','und':'Undetermined'}

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret) 
        auth.set_access_token(access_key, access_secret) 
        # Calling api 
        api = tweepy.API(auth) 
  
        tweets = api.user_timeline(screen_name=username) 
        
    
        for tweet in tweets:
            tweets_text.append(tweet.text)
            tweets_time.append(str(tweet.created_at).split()[0])
            pre_lang = str(tweet.lang)
            if pre_lang == "et":
                pre_lang="en"
            tweets_language.append(langs[pre_lang])
        
        #print(tweets_text)
        #print(tweets_time)
        print(tweets_language)



def remove_tags(text):
    return TAG_RE.sub('', text)

def get_blogs(username): 
    r = requests.get('https://medium.com/feed/@'+username)
    
    with open('blogs.xml', 'wb') as f: 
        f.write(r.content)
        
    tree = ET.parse('blogs.xml') 
    root = tree.getroot() 

    for item in root.findall('./channel/item'): 
        news = {} 
        for child in item: 
            if child.tag=='{http://purl.org/rss/1.0/modules/content/}encoded':
                medium_text.append(remove_tags(str(child.text)))
            if child.tag=='pubDate':
                date=str(child.text).split()
                names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                numbers=['01','02','03','04','05','06','07','08','09','10','11','12']
                mn=0
                
                for i in range(0,12):
                    if date[2] == names[i]:
                        mn=numbers[i]
                medium_time.append(date[3]+'-'+mn+'-'+date[1])
                
    #print(medium_text)
    #print(medium_time)

	
def get_posts(username): 
    
    json_data=open("instagram.json").read()
    data = json.loads(json_data)
    
    for i in range(0,len(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"])):
        instagram_text.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"])
        instagram_displayurl.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["display_url"])
        instagram_likes.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_liked_by"]["count"])
        
    print(instagram_text)
    print(instagram_displayurl)
    print(instagram_likes)
	
	
	
	



	
	
	 
app = Flask(__name__)

@app.route("/aggregate/<m>/<t>/<insta>",methods=['GET'])
def hello(m,t,insta):
    
	#oldirony,amitabhtiwari3,iam_niks026
	
	mediumid=m
	get_blogs(mediumid)
	twitterid=t
	get_tweets(twitterid)
	instagramid=insta
	get_posts(instagramid)
	
	
	result={}
	result['twitterid']=twitterid
	result['mediumid']=mediumid
	result['instagramid']=instagramid

	t_arr=[]      
	for i in range(0,len(tweets_text)):
		res={}
		res['text']=tweets_text[i]
		res['lang']=tweets_language[i]
		res['time']=tweets_time[i]
		t_arr.append(res)

	result['tweets']=t_arr

	m_arr=[]
	for i in range(0,len(medium_text)):
		res={}
		res['text']=medium_text[i]
		res['time']=medium_time[i]
		m_arr.append(res)
	result['blogs']=m_arr

	i_arr=[]
	for i in range(0,len(instagram_text)):
		res={}
		res['text']=instagram_text[i]
		res['url']=instagram_displayurl[i]
		res['likes']=instagram_likes[i]
		i_arr.append(res)
	result['posts']=i_arr

	#print(result)    


	e=requests.get('https://api.mlab.com/api/1/databases/ibm/collections/aggregate?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf')
	id=''
	for user in json.loads(e.text) :
		if user["twitterid"] == twitterid and user["mediumid"] == mediumid and user["instagramid"] == instagramid:
			id=user["_id"]["$oid"]
			requests.delete('https://api.mlab.com/api/1/databases/ibm/collections/aggregate/'+id+'?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf')
			break


	r = requests.post('https://api.mlab.com/api/1/databases/ibm/collections/aggregate?apiKey=WOHHCPMZkpDGw3EfKOIOYCZ7eA25aiLf', json = result)

        
	
	temp="Data has been Aggregated in MongoDB"
	return json.dumps(result)


if __name__ == '__main__':
    app.run(debug=True)