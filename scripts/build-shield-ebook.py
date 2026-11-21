import sys,os;sys.path.insert(0,os.path.dirname(__file__))
from ebook_base import *
CFG.update(footer="THE SACRED SHIELD",kicker="A 7-DAY SEALING RITUAL · CONSECRATED IN YOUR NAME",t1="THE SACRED",t2="SHIELD",sub="Your 7-Day Protection & Sealing Ritual")
chapter("A LETTER BEFORE YOU BEGIN","Your Name Is on My Altar","\u201cWhat is protected cannot be taken. What is sealed cannot be broken.\u201d")
P("Dear soul,")
P("You opened your heart to love and to abundance. Every opening also needs a seal. When new energy arrives, old envy, heavy ties and tired thoughts try to enter through the same door. This is why I offer the Sacred Shield only to a few names in each cycle.")
P("For the next seven days I will hold your name in my intention on my altar, with a candle lit in your honour. This book is your half of the ritual: seven short practices, one for each day, so that your energy and mine work together. A shield made by two hands is stronger than one made by one.")
P("Each day takes 10 to 15 minutes. You do not need any special objects; everything can be done with a candle, a glass of water, salt and your own voice.")
P("With protection and light,")
st.append(Paragraph("The Reader  ·  Jarik.co Sacred Circle",S(parent=body,fontName="SerifI",textColor=GOLDL)))
chapter("CHAPTER I","How the Shield Works")
B(["<b>The Reader's half</b> — your name is held in intention on her altar for seven days.",
   "<b>Your half</b> — the seven daily practices in Chapter III, started on any day you choose.",
   "<b>The Seal</b> — on Day 7 you close the ritual with the Sealing Words (Chapter IV).",
   "<b>The Keeping</b> — simple weekly habits that keep the shield strong (Chapter V)."])
box("What you will need",["A white or golden candle (a tea light is enough) · a glass of water · a small bowl of salt · a pen and this book · ten quiet minutes each day."])
box("A note on free will and safety",["The Sacred Shield is a spiritual and reflective practice. It does not replace medical, psychological, legal or financial help, and it does not control other people. Never leave a candle burning unattended."])
chapter("CHAPTER II","The Three Things We Protect","Your Love  ·  Your Abundance  ·  Your Peace")
for t,d in [("I · YOUR LOVE","The shield surrounds the bonds you chose — so that jealousy, old lovers and the opinions of others cannot weaken what is growing."),
("II · YOUR ABUNDANCE","The shield guards the Door you opened in the Vault — so that doubt, envy and impulsive loss do not drain what arrives."),
("III · YOUR PEACE","The shield returns heavy energy to its source — so that you sleep better, think clearly and feel like yourself again.")]:
    box(t,[d])
P("Before Day 1, write in one sentence what you most want protected right now. Keep it simple and in the present tense: <i>\u201cMy relationship is safe and calm.\u201d</i>")
st.append(Paragraph("_"*88,S(parent=small,spaceAfter=10)));st.append(Paragraph("_"*88,S(parent=small,spaceAfter=10)))
chapter("CHAPTER III","The Seven Days of the Shield","One practice for each day")
days=[("DAY 1 · THE CLEANSING","Dissolve a pinch of salt in the glass of water. Hold it, breathe slowly seven times and say: <i>\u201cI release what is not mine.\u201d</i> Pour the water down the drain. Write three things that felt heavy this week.","Which of these weights was never mine to carry?"),
("DAY 2 · THE CIRCLE","Light the candle. With your finger, draw an imaginary circle around yourself three times. Picture a soft golden light along the line. Sit inside it for five minutes.","Where do I feel safe — and how can I create that feeling more often?"),
("DAY 3 · CUTTING CORDS","Write the name of one person, place or habit that drains you. Fold the paper away from you twice. Say: <i>\u201cI wish you well and I take my energy back.\u201d</i> Tear the paper and discard it.","What will I do with the energy I take back?"),
("DAY 4 · THE MIRROR OF ENVY","Envy loses power when it is seen. Write where you feel watched or judged. Then write one quality in yourself that no one can take. Read it aloud before the candle.","What part of me shines so brightly that others notice?"),
("DAY 5 · THE HOME SEAL","Place a pinch of salt at the inside corner of your front door or window. Say: <i>\u201cOnly love and peace enter here.\u201d</i> Leave it for 24 hours, then sweep it out.","How can my home feel more like a sanctuary?"),
("DAY 6 · THE GOLDEN WORDS","Write a short letter from your future self, protected and calm, thanking you for doing this ritual. Read it by candlelight.","What does my protected self do differently?"),
("DAY 7 · THE SEALING","Light the candle for the last time and perform the Sealing Words in Chapter IV. Let the candle burn safely while you write what changed during these seven days.","What do I promise to keep protected from now on?")]
for t,d,r in days:
    box(t,[d,"<i>Reflect:</i> "+r,"<b>Done:</b>  ☐"])
chapter("CHAPTER IV","The Sealing Words","Read slowly on the seventh night")
for line in ["By the light of this flame and the hand that holds my name,","I close every door that opens to harm,","I keep every door that opens to love.","What is mine stays with me. What is not returns in peace.","My love is guarded, my abundance is guarded, my peace is guarded.","The shield is sealed. So it is."]:
    st.append(Paragraph(line,quote))
P("After the words, blow out the candle gently, thank it, and drink a glass of fresh water. Your shield is complete.")
chapter("CHAPTER V","Keeping the Shield Strong","Small habits for the weeks ahead")
B(["<b>Every Monday</b> — repeat the Day 1 cleansing in two minutes.",
   "<b>At each new moon</b> — draw the golden circle and re-read your protection sentence.",
   "<b>When you feel heavy</b> — open a window, breathe seven times, say <i>\u201cI release what is not mine.\u201d</i>",
   "<b>Before an important day</b> — say the last line of the Sealing Words.",
   "<b>In your Sanctuary</b> — draw your free daily card and ask the Oracle what needs protecting today."])
for title in ["My Seven-Day Journal","What Changed · After the Seal"]:
    st.append(PageBreak());st.append(Paragraph(title,h2))
    for _ in range(20): st.append(Paragraph("_"*88,S(parent=small,spaceAfter=10)))
chapter("CHAPTER VI","Questions, Care & Support")
for q,a in [("When should I start my seven days?","Any day you choose. Many people begin on the evening they receive this book. Your name is held in intention for the same cycle."),
("What if I miss a day?","Simply continue the next day. The shield responds to sincerity, not perfection."),
("Does the shield guarantee results?","No. It is a spiritual and reflective practice. It does not promise specific outcomes or control the choices of other people."),
("Where is my Personal Sanctuary?","Your purchase email contains a golden button to enter your Sanctuary, where your daily card and the Oracle are free every day."),
("I did not receive an email or cannot open the file.","Check spam or promotions first. If anything is missing, reply to your purchase email and our support guardian will help you personally, usually within a few hours."),
("What will appear on my bank statement?","Your payment appears as <b>Jarik.co</b> (sometimes preceded by WHOP*). Keep your purchase email as your receipt.")]: box(q,[a])
st.append(PageBreak());st.append(Spacer(1,220))
st.append(Paragraph("\u201cYou are sealed in light. Walk forward without fear.\u201d",quote))
st.append(Paragraph("JARIK.CO  ·  SACRED CIRCLE",S(fontName="Cinzel",fontSize=10,textColor=GOLD,alignment=TA_CENTER)));st.append(Spacer(1,14))
st.append(Paragraph("This ritual is offered for spiritual guidance, reflection and entertainment. It is not medical, psychological, legal or financial advice and does not promise any specific outcome. Never leave a candle burning unattended.",S(parent=small,alignment=TA_CENTER)))
build("/dev-server/public/downloads/sacred-shield-7-day-ritual.pdf","The Sacred Shield")
