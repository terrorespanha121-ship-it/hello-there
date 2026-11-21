import sys,os;sys.path.insert(0,os.path.dirname(__file__))
from ebook_base import *
CFG.update(footer="THE VAULT OF ABUNDANCE 2027",kicker="A SEALED READING · OPENED ONLY FOR YOU",t1="THE VAULT OF",t2="ABUNDANCE",sub="Your 2027 Prosperity Reading & 12-Moon Guide")
chapter("A LETTER BEFORE YOU BEGIN","The Vault I Never Opened","\u201cAbundance is not luck. It is energy that finally recognises its rightful keeper.\u201d")
P("Dear soul,")
P("For twenty-seven years I kept a sacred oath: the Vault of Abundance would stay sealed. I read love, I read destiny, but this deck of prosperity I kept for myself and my lineage. When your energy touched my cards, they moved in a way I could not ignore. So I opened it — for you.")
P("This book is the full reading of your year 2027: the archetypes guiding your material life, the blockages that keep abundance from staying with you, three rituals to open your flow, and a 12-moon calendar so you know the best moments to start, ask, decide and rest.")
P("Abundance here means more than money. It is energy, opportunity, health of spirit, good people and the courage to receive. Read slowly. Act on what you read.")
P("With light and prosperity,")
st.append(Paragraph("The Reader  ·  Jarik.co Sacred Circle",S(parent=body,fontName="SerifI",textColor=GOLDL)))
chapter("CHAPTER I","How to Use This Book")
B(["<b>Chapter II</b> — The Three Keys of Your Vault: your 2027 abundance spread.",
   "<b>Chapter III</b> — The Five Blockages of Abundance and how to dissolve them.",
   "<b>Chapter IV</b> — The Golden Coin Ritual (new moon).",
   "<b>Chapter V</b> — The Cinnamon Threshold & the Bay Leaf Wish.",
   "<b>Chapter VI</b> — The Abundance Arcana: all 22 Major Arcana in material life.",
   "<b>Chapter VII</b> — Your 12-Moon Calendar for 2027 and gratitude pages.",
   "<b>Chapter VIII</b> — Questions, care and how to reach us."])
box("A note on free will and responsibility",["This reading is spiritual guidance. It does not promise any amount of income and it is not financial advice. The rituals work on focus, intention and energy; practical decisions about money, work and investments remain yours and should be made with care and, when needed, with a qualified professional."])
chapter("CHAPTER II","The Three Keys of Your Vault","The Root  ·  The Door  ·  The Treasure")
box("I · THE ROOT — What you learned about receiving",["The first key shows the beliefs about abundance you inherited: \u201cmoney is hard\u201d, \u201cpeople like us never have enough\u201d, \u201cwanting more is selfish\u201d. These sentences were spoken around you long before you could choose. In 2027 the Vault asks you to replace them.","<b>Your task:</b> write the three money sentences you heard most as a child. Next to each, write its opposite and read it every morning for 21 days.","<i>Reflect:</i> Whose voice do I hear when I hesitate to ask for what I deserve?"])
box("II · THE DOOR — The opportunity arriving in 2027",["The second key reveals a door: a skill you have undervalued, a project you postponed, a person who can open a path. The cards show it arriving through something you already know how to do — not through a miracle from outside.","<b>Signs to notice:</b> people asking you for help with the same thing, an idea that returns again and again, an invitation to a new environment.","<b>Your task:</b> list three things people thank you for. One of them is the Door.","<i>Reflect:</i> What gift do I give away freely that the world would value?"])
box("III · THE TREASURE — Where your abundance flows",["The third key shows where your effort finds reward when you walk with awareness: stability, freedom, a home that feels safe, the ability to help those you love. It is the \u201cwhy\u201d that will keep you going when motivation fades.","<b>Your task:</b> write one page describing an ordinary day at the end of 2027 when you feel abundant. Be specific: where you wake up, how you feel, who is with you.","<i>Reflect:</i> If abundance arrived tomorrow, what would I do first?"])
chapter("CHAPTER III","The Five Blockages of Abundance","What closes the Vault — and how to open it")
for t,d,r in [("The Guilt of Wanting","Feeling that desiring more makes you less spiritual or less kind.","Repeat: <i>\u201cMy abundance allows me to give more.\u201d</i> Donate a small, symbolic gift this week."),
("The Leaking Hand","Abundance arrives and disappears just as fast.","Choose one small amount to keep untouched each week — the size matters less than the consistency."),
("The Invisible Worth","Undercharging, over-giving, apologising for your time.","Say your value out loud once a day. Notice one place where you give too much without return."),
("The Cluttered Space","Stagnant objects, unpaid small debts, unanswered messages create stagnant energy.","Clear one drawer, one bill and one message each week of the first moon."),
("The Fear of Visibility","Hiding your work so that no one can judge it.","Share one thing you made or know with one person each week.")]:
    box(t,[d,"<b>Release:</b> "+r])
chapter("CHAPTER IV","The Golden Coin Ritual","Performed on the new moon")
P("<b>You need:</b> a gold or yellow candle, one coin, a small green or golden cloth, a pinch of cinnamon. <b>Time:</b> 10 minutes.")
B(["Clean the place where you will perform the ritual and open a window for one minute.","Light the candle and hold the coin in your right hand.","Say: <i>\u201cAs this coin rests in my hand, abundance rests in my life. It enters with ease and it stays with purpose.\u201d</i>","Sprinkle the cinnamon over the coin and wrap it in the cloth.","Keep it in your wallet or purse until the next new moon, then spend the coin consciously on something that brings you joy, and begin again."])
chapter("CHAPTER V","The Cinnamon Threshold & the Bay Leaf Wish")
box("The Cinnamon Threshold · first day of each month",["Stand at your front door with a pinch of ground cinnamon in your right palm. Say: <i>\u201cWhen this cinnamon blows, prosperity will come in; when this cinnamon blows, abundance will stay.\u201d</i> Blow the cinnamon gently inside your home. Sweep it out the next day."])
box("The Bay Leaf Wish · any Thursday",["Write one concrete intention for the month on a dry bay leaf with a pen. Hold it to your heart, read it three times, then (safely) burn it in a heat-proof bowl or keep it in a jar with other wishes. Write the date in your gratitude pages so you can see later what came true."])
box("Daily · The Gratitude Ledger",["Each night, write three things that arrived today — a kind word, an opportunity, a coin found, a solved problem. Abundance grows where it is noticed."])
chapter("CHAPTER VI","The Abundance Arcana","What each Major Arcana says about your material life")
for n,t in [("0 · The Fool","A new venture; begin small, begin now."),("I · The Magician","Use the skills you already have; you are resourceful."),("II · The High Priestess","Trust your instinct about a deal or offer."),("III · The Empress","Growth and fertility of projects; nurture them."),("IV · The Emperor","Structure, budgets and long-term stability."),("V · The Hierophant","Learn from a mentor; respected paths pay off."),("VI · The Lovers","A partnership decision; choose aligned values."),("VII · The Chariot","Discipline brings victory; stay focused."),("VIII · Strength","Patience over panic in uncertain moments."),("IX · The Hermit","Plan quietly before you expand."),("X · Wheel of Fortune","A turn of luck; be ready to act."),("XI · Justice","Contracts, fairness and what you are owed."),("XII · The Hanged Man","Pause a decision; a new perspective appears."),("XIII · Death","End what no longer pays your soul."),("XIV · Temperance","Balance spending and saving; steady flow."),("XV · The Devil","Watch impulsive spending and old debts."),("XVI · The Tower","Sudden change that clears a false foundation."),("XVII · The Star","Renewed hope; a long-term vision forms."),("XVIII · The Moon","Read the fine print; not all is as it seems."),("XIX · The Sun","Success, recognition and visible results."),("XX · Judgement","A calling; a second chance at an old dream."),("XXI · The World","Completion of a cycle; a goal reached.")]:
    st.append(Paragraph("<font name='Cinzel' color='#d4a84b'>%s</font> — %s"%(n,t),bul,bulletText="✦"))
chapter("CHAPTER VII","Your 12-Moon Calendar for 2027","One focus for each month of the year")
rows=[["Month","Energy","Your focus"]]
for m,e,f in [("January","The Root","Rewrite your money sentences"),("February","Clearing","Dissolve the Cluttered Space"),("March","The Door","Name the gift you undervalue"),("April","Planting","Begin one small project"),("May","Visibility","Share your work weekly"),("June","Balance","Plug the Leaking Hand"),("July","Expansion","Say yes to one new opportunity"),("August","Worth","Raise the value you ask for"),("September","Harvest","Review what grew; give thanks"),("October","Protection","Release what drains you"),("November","Generosity","Give a symbolic gift"),("December","The Treasure","Re-read your abundant day page")]: rows.append([m,e,f])
t=Table(rows,colWidths=[80,90,W-290]);t.setStyle(TableStyle([("FONT",(0,0),(-1,0),"Cinzel",9),("FONT",(0,1),(-1,-1),"Serif",9),("TEXTCOLOR",(0,0),(-1,0),GOLD),("TEXTCOLOR",(0,1),(-1,-1),TXT),("GRID",(0,0),(-1,-1),0.4,GOLD),("BACKGROUND",(0,0),(-1,-1),PANEL),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
st.append(t);st.append(Spacer(1,12))
P("<b>Strongest days:</b> new moons for beginnings, Thursdays for growth and the first day of each month for the Cinnamon Threshold.")
for title in ["My Three Money Sentences · and their opposites","My Abundant Day at the End of 2027","Gratitude Ledger"]:
    st.append(PageBreak());st.append(Paragraph(title,h2))
    for _ in range(20): st.append(Paragraph("_"*88,S(parent=small,spaceAfter=10)))
chapter("CHAPTER VIII","Questions, Care & Support")
for q,a in [("Does this reading guarantee I will earn more?","No. No reading can promise an amount of income. This book helps you see your patterns, focus your intention and act with clarity. Your results depend on your own choices and circumstances."),
("When should I start?","Begin with Chapter II today, and perform the Golden Coin Ritual on the next new moon."),
("Where is my Personal Sanctuary?","Your purchase email contains a golden button to enter your Sanctuary, where your daily card and the Oracle are free every day."),
("I did not receive an email or cannot open the file.","Check spam or promotions first. If anything is missing, reply to your purchase email and our support guardian will help you personally, usually within a few hours."),
("What will appear on my bank statement?","Your payment appears as <b>Jarik.co</b> (sometimes preceded by WHOP*). Keep your purchase email as your receipt.")]: box(q,[a])
st.append(PageBreak());st.append(Spacer(1,220))
st.append(Paragraph("\u201cThe Vault is open now. Walk through it with gratitude, and it will never close for you again.\u201d",quote))
st.append(Paragraph("JARIK.CO  ·  SACRED CIRCLE",S(fontName="Cinzel",fontSize=10,textColor=GOLD,alignment=TA_CENTER)));st.append(Spacer(1,14))
st.append(Paragraph("This reading is offered for spiritual guidance, reflection and entertainment. It is not financial, legal, medical or psychological advice and does not promise any specific outcome.",S(parent=small,alignment=TA_CENTER)))
build("/dev-server/public/downloads/vault-of-abundance-2027.pdf","The Vault of Abundance 2027")
