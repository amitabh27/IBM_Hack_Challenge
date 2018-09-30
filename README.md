# hackathon
SHADE Engine to detect the emotions of a person based on his/her social media activity and recommend measures to improve upon the same.
<ul>
  <li>Ideation document : </li>
  <li> Presentation Slides : </li>
  <li> Working of solution (video) : </li>
</ul>

# Problem Statement

Help me with my Mood with Social-media Health Analysis and Display Engine (SHADE) is a software solution which tries to analyse your current emotions based on the content that you share on different social media websites. With advances in technology, it has now become easy to detect the emotions user is going though by using NLP on the text shared which when combined with visual recognition on the images gives a concrete solution to take calm down measures before hand he/she chooses any drastic actions.

# Proposed Solution

<ul>
  <li>The social media websites that we are targeting to understand user's current emotions are :</li>
  <ul>
    <li><b>Twitter</b> : We see twitter as a place where people express their instant emotions about Named Entities(Name,place,Product,Organisation etc).</li>
    <li><b>Instagram </b>: We see instagram as a rich source of data because of the #Tags usage and images a user shares which points to his current mental well being</li>
    <li><b>Medium </b>: The earlier two websites are used by people to express their momentary emotions where as when it comes to the most popular blog website like medium, analysing user's blogs gives you deep insights about his interests,personality and his state of mind.</li>
  </ul>
  
<li>
  The software solution will have the following components :
  <ul>
    <li><b>Data Aggregator </b>: It will be a REST Server to aggregate data from different social media websites and put it in a NoSQL DB</li>
    <li><b>Data Analyser </b>: It shall use the data aagregated previously and use IBM Watson components like Language Transaltor,NLP and Analytics,Tone Analyser,Personality Insights,Custom Models to understand user's state of mind.</li>
    <li><b>Suggested Measures </b>: Once the user's state of mind has been understood. We shall give him data visualizayions to help him understand himself better and songs,videos,articles,yoga asanas and nearby places to eat,worship or of natural beauty depending the most prominent emotion detected.</li>
   </ul>
</li>  
  
</ul>

# Architecture of solution implemented
<br>

![architecture](https://github.com/amitabh27/hackathon/blob/master/gitRepo%20metadata/archi.png)

# Technology Stack used 

<ul>
  <li><b> ibm-aggregator : </b></li>
  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : Python</li>
     <li>App : Flask App</li>
     <li>Hosted : heroku </li>
     <li>Major API Endpoint : http://ibm-aggregator.herokuapp.com/aggregate/valid_mediumID/valid_twitterID/valid_instagramID</li>
    <li> 3rd Party APIs used : Twitter REST API,Medium RSS Feed, Instagram APIs. </li>
  </ul>
  <li><b> ibmanalyser : </b></li>
  <ul>
     <li>Server-Type : NodeJS Project (Web-APP + REST Server)</li>
     <li>Programming Language : NodeJS with Express Framework</li>
     <li>App : NodeJS App</li>
     <li>Hosted : IBM Cloud </li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Major API Endpoint : https://ibmanalyser.eu-gb.mybluemix.net/readProfile/valid_twitterID/valid_mediumID/valid_instagramID</li>
    <li> 3rd Party APIs used : Youtube APIs, Nearby Places APIs,Google Chart APIs,Algorithmia Models,IBM Custom Model APIs,ibm-recommender APIs, IBM - Language Transaltor,NLP and Analytics,Tone Analyser,Personality insights etc</li>
  </ul> 
  <li><b> ibm-recommender : </b></li>
  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : Python</li>
     <li>App : Flask App</li>
     <li>Hosted : heroku </li>
     <li>Major API Endpoint : http://ibm-recommender.herokuapp.com/recommendations/emotion_detected</li>
    <li> Machine Learning Models Used : LDA and Tf-IDF</li>
    <li>Data for ML Models : CSVs with tips from doctors and psychologists to fight different emotions.</li>
  </ul>
  <li>For instagram, business accounts were having a 15days approval period to get access to APIs but since we dint have that much of time, we used a hack wherein the instagram data of any user can be obtained from this URL : https://www.instagram.com/iam_niks026/?__a=1
   where iam_niks026 is the "TwitterHandle".So currently we have used that as the JSON Response and kept it on server and built a JSON parser on top of it. When the solution goes live the FILE Reading will be replaced by the API calling.</li>
</ul>



# Implementation Details 

<h4> Module 1 : ibm-aggregator </h4>
<ul>
  <li> Python Libraries Used : Flask,tweepy,json,csv,requests,xml.etree.ElementTree</li>
  <li> For each user we have a single document in the collection "aggregate" fo DB "ibm" in MongoDB. When the user first enters the system, ibm-aggregator checks the DB if these set of social-media IDs exist in DB. If not implies he has come to the web app for the first time and a new document is created for him.If not then the previous document is deleted and a new one is created for him.</li>
  <li><h6> Twitter Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get user's tweets of past 7 days to undertsand what were the instantaneoud emotions he went though.</li>
    <li> Data collected : For each tweet, we collect tweet text,time and language of tweet.</li>
  </ul>
  <li><h6> Instagram Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get hash tags of each post which convey user's current state of mind and perform visual recognition on images.</li>
    <li> Data collected : For each post, we collect post's hashtages and post's image URL and number of likes and store it in DB<li>
  </ul>
  <li><h6> Medium Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get insights into user's perosnality and interests.</li>
    <li>Data Collected : For each blog, the blog content and date of publish.</li>
  </ul>
  
  <li><h6> Process Flow : </h6></li>
  <ul>
  <li>When user provides the social media handles the UserInterface first calls the ibm-aggregator module to fetch the data into DB which would be then analysed.</li>
  <li>Typical API Call looks like : http://ibm-aggregator.herokuapp.com/aggregate/oldirony/amitabhtiwari3/pandey_amita</li>
  <li>Now the DB Document created for this user looks like: 
    ![ibm-agg-DB1](https://github.com/amitabh27/hackathon/blob/master/gitRepo%20metadata/ibm-agg1.png)
    ![ibm-agg-DB2](https://github.com/amitabh27/hackathon/blob/master/gitRepo%20metadata/ibm-agg2.png)
    ![ibm-agg-DB3](https://github.com/amitabh27/hackathon/blob/master/gitRepo%20metadata/ibm-agg3.png)
  </li>
  </ul>
</ul>


