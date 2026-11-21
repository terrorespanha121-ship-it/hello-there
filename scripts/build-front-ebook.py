from reportlab.lib.pagesizes import A4
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, NextPageTemplate
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math
pdfmetrics.registerFont(TTFont("Sym",__import__("subprocess").check_output(["fc-match","-f","%{file}","DejaVu Sans"],text=True).strip()))
pdfmetrics.registerFont(TTFont("Cinzel","/tmp/ebook/cinzel.ttf"))
pdfmetrics.registerFont(TTFont("Serif","/usr/share/fonts/truetype/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("SerifB","/usr/share/fonts/truetype/DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("SerifI","/usr/share/fonts/truetype/DejaVuSerif-Italic.ttf"))
from reportlab.lib.fonts import addMapping
addMapping("Serif",0,0,"Serif");addMapping("Serif",1,0,"SerifB");addMapping("Serif",0,1,"SerifI");addMapping("Serif",1,1,"SerifB")
BG=HexColor("#120d0a");PANEL=HexColor("#1d1510");GOLD=HexColor("#d4a84b");GOLDL=HexColor("#ecd08f");TXT=HexColor("#e9dfcf");MUT=HexColor("#a99a83")
W,H=A4
def star(c,x,y,r):
    c.setFillColor(GOLD);c.circle(x,y,r,stroke=0,fill=1)
def deco(c,doc):
    c.saveState();c.setFillColor(BG);c.rect(0,0,W,H,stroke=0,fill=1)
    c.setStrokeColor(GOLD);c.setLineWidth(0.6);c.rect(22,22,W-44,H-44)
    c.setLineWidth(0.3);c.rect(27,27,W-54,H-54)
    for (x,y) in [(22,22),(W-22,22),(22,H-22),(W-22,H-22)]:
        star(c,x,y,2.4)
    c.setFont("Cinzel",7.5);c.setFillColor(MUT)
    c.drawCentredString(W/2,38,"THE SACRED GOLDEN SCROLL  ·  JARIK.CO  ·  %d"%doc.page)
    c.restoreState()
def cover(c,doc):
    c.saveState();c.setFillColor(BG);c.rect(0,0,W,H,stroke=0,fill=1)
    c.setStrokeColor(GOLD);c.setLineWidth(1);c.rect(22,22,W-44,H-44);c.setLineWidth(0.4);c.rect(30,30,W-60,H-60)
    cx,cy=W/2,H/2+90
    for r in (120,100,62):
        c.setLineWidth(0.6 if r!=100 else 0.3);c.circle(cx,cy,r)
    for i in range(12):
        a=i*math.pi/6;c.line(cx+62*math.cos(a),cy+62*math.sin(a),cx+100*math.cos(a),cy+100*math.sin(a))
        star(c,cx+110*math.cos(a+math.pi/12),cy+110*math.sin(a+math.pi/12),1.8)
    p=c.beginPath();
    for i in range(10):
        r=48 if i%2==0 else 19;a=math.pi/2+i*math.pi/5
        (p.moveTo if i==0 else p.lineTo)(cx+r*math.cos(a),cy+r*math.sin(a))
    p.close();c.setFillColor(GOLD);c.drawPath(p,stroke=0,fill=1)
    c.setFillColor(GOLDL);c.setFont("Cinzel",11);c.drawCentredString(W/2,H-95,"A PERSONAL CONSECRATION OF THE GOLDEN TAROT")
    c.setFont("Cinzel",38);c.drawCentredString(W/2,H/2-90,"THE SACRED");c.drawCentredString(W/2,H/2-135,"GOLDEN SCROLL")
    c.setFillColor(TXT);c.setFont("SerifI",13);c.drawCentredString(W/2,H/2-172,"Your Complete Destiny Reading & 90-Day Guide")
    c.setStrokeColor(GOLD);c.line(W/2-60,H/2-195,W/2+60,H/2-195)
    c.setFillColor(MUT);c.setFont("Serif",10);c.drawCentredString(W/2,H/2-220,"Prepared and consecrated for:")
    c.setStrokeColor(GOLD);c.setLineWidth(0.5);c.line(W/2-130,H/2-262,W/2+130,H/2-262)
    c.setFont("Cinzel",9);c.setFillColor(GOLD);c.drawCentredString(W/2,70,"JARIK.CO  ·  SACRED CIRCLE")
    c.restoreState()
S=lambda **k:ParagraphStyle("x",**k)
h1=S(fontName="Cinzel",fontSize=22,leading=28,textColor=GOLD,alignment=TA_CENTER,spaceAfter=6)
kick=S(fontName="Cinzel",fontSize=8.5,leading=12,textColor=MUT,alignment=TA_CENTER,spaceAfter=4)
h2=S(fontName="Cinzel",fontSize=13,leading=18,textColor=GOLDL,spaceBefore=12,spaceAfter=6)
body=S(fontName="Serif",fontSize=10.2,leading=15.6,textColor=TXT,alignment=TA_JUSTIFY,spaceAfter=7)
quote=S(fontName="SerifI",fontSize=11,leading=16,textColor=GOLDL,alignment=TA_CENTER,spaceBefore=6,spaceAfter=10,leftIndent=30,rightIndent=30)
small=S(fontName="Serif",fontSize=9,leading=13,textColor=MUT,spaceAfter=4)
bul=S(parent=body,leftIndent=14,bulletIndent=2,spaceAfter=4,bulletFontName="Sym",bulletColor=GOLD)
cardT=S(fontName="Cinzel",fontSize=11,leading=14,textColor=GOLD,spaceAfter=3)
cardB=S(fontName="Serif",fontSize=9.2,leading=13.2,textColor=TXT,alignment=TA_JUSTIFY)
st=[]
def chapter(k,t,sub=None):
    st.append(PageBreak());st.append(Spacer(1,20));st.append(Paragraph(k,kick));st.append(Paragraph(t,h1))
    st.append(Paragraph("✦  ✦  ✦",S(fontName="Sym",fontSize=9,textColor=GOLD,alignment=TA_CENTER,spaceAfter=10)))
    if sub: st.append(Paragraph(sub,quote))
P=lambda t:st.append(Paragraph(t,body))
B=lambda items:[st.append(Paragraph(i,bul,bulletText="✦")) for i in items]
def box(title,lines):
    inner=[Paragraph(title,cardT)]+[Paragraph(l,cardB) for l in lines]
    t=Table([[inner]],colWidths=[W-150]);t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PANEL),("BOX",(0,0),(-1,-1),0.6,GOLD),("LEFTPADDING",(0,0),(-1,-1),14),("RIGHTPADDING",(0,0),(-1,-1),14),("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),12)]))
    st.append(KeepTogether([t,Spacer(1,10)]))

st.append(NextPageTemplate("main"));
# ---------- Letter
chapter("A LETTER BEFORE YOU BEGIN","Your Path Was Not an Accident","\u201cThe cards do not choose randomly. They answer the soul that dares to ask.\u201d")
P("Dear soul,")
P("The moment you confirmed your reading, your name and your energy were brought to my altar. The candle was lit, the golden deck was cleansed with sacred smoke, and the cards you were drawn to during your reading were laid out in the order your spirit chose them.")
P("What you hold in your hands is not a generic horoscope and not a page written for everyone. It is a complete guide built around the archetypes that appeared for you, the season of life you are crossing, and the practical steps that will help you walk through the next 90 days with clarity instead of fear.")
P("I ask you one thing: do not rush through this scroll. Read it slowly, ideally at night, in a quiet place. Return to it whenever you feel lost. Many of the messages will make more sense in a week or a month than they do today — this is how the Tarot speaks. It plants seeds first, and only later do you see the flowers.")
P("Everything inside has been prepared to be used, not just read. There are rituals, reflections, and a 90-day calendar. The women who receive the most from their reading are the ones who live it.")
P("With serenity and protection,")
st.append(Paragraph("The Reader  ·  Jarik.co Sacred Circle",S(parent=body,fontName="SerifI",textColor=GOLDL)))
# ---------- How to use
chapter("CHAPTER I","How to Receive This Reading")
P("Before you read your cards, take three minutes to prepare. This is not superstition — it is focus. A calm mind receives a message; an anxious mind only hears noise.")
st.append(Paragraph("The Three-Breath Opening",h2))
B(["Sit somewhere you will not be interrupted. Silence your phone or place it face down.",
   "If you can, light a candle (any candle will do) or simply dim the lights.",
   "Breathe in slowly for four counts, hold for four, and release for six. Do this three times.",
   "Say quietly, out loud or in your heart: <i>\u201cI am ready to see what my soul already knows.\u201d</i>"])
st.append(Paragraph("What This Scroll Contains",h2))
B(["<b>Chapter II</b> — The meaning of your three-card spread: Past, Present and Destiny.",
   "<b>Chapter III</b> — The Golden Arcana: the complete meaning of all 22 Major Arcana, so you can find the exact card that appeared for you.",
   "<b>Chapter IV</b> — Your 90-day forecast for love, energy and life path.",
   "<b>Chapter V</b> — Hidden blockages and how to release them.",
   "<b>Chapter VI</b> — The Night Ritual of Activation (3 minutes).",
   "<b>Chapter VII</b> — Your 90-day sacred calendar and reflection pages.",
   "<b>Chapter VIII</b> — Questions, care and how to reach us."])
box("A note on free will",["The Tarot shows the strongest current flowing through your life right now. It does not chain you to a fate. Every message in this scroll is a map, and you are still the one walking. Use it as guidance, never as a reason to give up your own judgment, your health decisions or professional advice."])
# ---------- Spread
chapter("CHAPTER II","Your Three-Card Spread","Past  ·  Present  ·  Destiny")
P("During your reading, three positions were opened for you. Each card occupies one position, and the position changes how the card speaks. Find the cards that appeared for you in Chapter III and read them through the lens of their position below.")
box("I · THE PAST — The Root",["This card reveals the energy you have been carrying, often for longer than you realise. It may be a wound, a promise you made to yourself, or a pattern inherited from your family. It is not here to make you relive pain; it is here so you can finally name it — and what is named loses its power over you.","<i>Reflect:</i> Where in my life do I still act as the person I was years ago?"])
box("II · THE PRESENT — The Crossroads",["This is the most important card of your reading. It shows the decision, tension or opportunity standing in front of you right now. Many women feel a strange sense of recognition when they read it, as if someone had been watching their days. Trust that feeling.","<i>Reflect:</i> What am I avoiding because I already know the answer?"])
box("III · DESTINY — The Unfolding",["This card shows where your current path leads if you keep walking with awareness. It is a promise and an invitation. If the card feels heavy, it is a warning to change direction gently. If it feels luminous, it is confirmation that the door is opening.","<i>Reflect:</i> What would I do this week if I truly believed this card?"])
P("<b>How to combine them:</b> read the three cards as one sentence. <i>\u201cBecause of [Past], I now face [Present], and if I honour it, I will reach [Destiny].\u201d</i> Write this sentence in the reflection pages at the end of this scroll. It will become your compass for the next three months.")
# ---------- Arcana
chapter("CHAPTER III","The Golden Arcana","The 22 doors of the soul")
P("Below are the complete meanings of the 22 Major Arcana of the Golden Tarot. Find each of your cards and read three layers: its light (what it brings), its shadow (what it warns), and its message for love.")
arc=[("0 · The Fool","A new beginning, a leap of faith, the courage to start before you feel ready.","Recklessness, ignoring warning signs, running from responsibility.","A fresh romance or a fresh way of loving yourself. Stay open, but keep your eyes open."),
("I · The Magician","You already hold every tool you need. Willpower, manifestation, skill.","Manipulation, scattered energy, promises without action.","Someone with a charming tongue — watch actions, not words. Or: you are ready to attract."),
("II · The High Priestess","Intuition, hidden knowledge, the voice inside that is never wrong.","Secrets kept from you, ignoring your gut, silence that hurts.","There is something unspoken between you and another. Your intuition already knows it."),
("III · The Empress","Abundance, fertility of ideas, beauty, nurturing and being nurtured.","Giving everything and receiving nothing, neglecting yourself.","Love blossoms when you stop over-giving and allow yourself to be cared for."),
("IV · The Emperor","Structure, stability, protection, building something that lasts.","Control, rigidity, a partner or authority who dominates.","A stable, serious bond — or a reminder that love is not control."),
("V · The Hierophant","Tradition, wisdom, commitment, a teacher or guide appears.","Rules that no longer serve you, pressure from family or society.","Commitment, engagement, a relationship that seeks a sacred form."),
("VI · The Lovers","A soul connection, an important choice made from the heart.","Indecision, temptation, a choice between two paths or two people.","A significant union. The cards ask you to choose with your whole heart, not out of fear."),
("VII · The Chariot","Victory through determination, movement, a journey forward.","Losing direction, being pulled in two directions.","Take the lead in love. Stagnation ends when you decide."),
("VIII · Strength","Inner power, gentleness that conquers, patience, courage.","Self-doubt, suppressed emotions, losing your temper.","Love that heals through patience. You are stronger than the situation."),
("IX · The Hermit","Wisdom found in solitude, introspection, a spiritual pause.","Isolation, loneliness, closing your heart to protect it.","A season of healing before a deeper love. Do not fear the quiet."),
("X · Wheel of Fortune","Cycles turning, luck, sudden change in your favour.","Resisting change, repeating the same cycle.","Destiny moves. Someone may return, or a long cycle finally ends."),
("XI · Justice","Truth, balance, fair outcomes, karma rebalanced.","Unfairness, avoiding accountability, legal or moral tension.","The truth of a relationship surfaces. What is fair stays; what is not, falls."),
("XII · The Hanged One","Surrender, a new perspective, a meaningful pause.","Stalling, martyrdom, sacrificing yourself for nothing.","Stop waiting for someone to change. See the situation from a new angle."),
("XIII · Death","Transformation, an ending that makes space for rebirth.","Clinging to what is already gone, fear of change.","A chapter closes so a truer love can begin. This is renewal, not loss."),
("XIV · Temperance","Harmony, healing, patience, the right measure in all things.","Excess, imbalance, impatience.","A calm, healing love. Balance between giving and receiving returns."),
("XV · The Devil","Recognising attachments and breaking chains, raw desire.","Obsession, toxic bonds, addiction, feeling trapped.","A powerful attraction. Ask honestly: does this bond free me or bind me?"),
("XVI · The Tower","Sudden revelation, the collapse of illusions, liberation.","Chaos, fear of collapse, resisting a necessary breakdown.","The truth breaks through. What falls was never built on solid ground."),
("XVII · The Star","Hope, renewal, spiritual healing, wishes heard.","Discouragement, losing faith, disconnection.","Healing after heartbreak. A gentle, hopeful love is on its way."),
("XVIII · The Moon","Dreams, the unconscious, intuition through uncertainty.","Illusion, anxiety, deception, confusion.","Not everything is as it seems. Wait for clarity before deciding."),
("XIX · The Sun","Joy, success, vitality, clarity, the golden light.","Temporary clouds, overconfidence.","Happiness, warmth and a love lived in the open. One of the most blessed cards."),
("XX · Judgement","Awakening, a calling, forgiveness, a second chance.","Self-judgment, refusing to learn from the past.","Reconciliation or a powerful second chance. The past is forgiven."),
("XXI · The World","Completion, fulfilment, wholeness, a cycle perfected.","Unfinished business, delay before the finish line.","A love that feels like home. A cycle reaches its fullness.")]
for n,l,s,lv in arc:
    box(n.upper(),["<font color='#ecd08f'>Light —</font> "+l,"<font color='#ecd08f'>Shadow —</font> "+s,"<font color='#ecd08f'>In love —</font> "+lv])
# ---------- Forecast
chapter("CHAPTER IV","Your 90-Day Forecast","Three moons, three movements")
P("The energy of your spread moves in three phases. Each phase lasts roughly one lunar cycle. You may feel these shifts earlier or later — trust your own rhythm more than the calendar.")
for t,lines in [("FIRST MOON · Days 1–30 · Release",["The first month is about letting go. You may feel old memories rising, people from the past appearing in your thoughts or dreams, or a sudden tiredness. This is not a bad sign — it is the old energy leaving.","<b>Love:</b> clarity about what you no longer accept. <b>Energy:</b> rest more than usual. <b>Path:</b> finish one thing you left unfinished."]),
("SECOND MOON · Days 31–60 · Alignment",["The fog begins to lift. Coincidences increase: messages arrive at the right time, numbers repeat, conversations open doors. This is when your Present card becomes active.","<b>Love:</b> a meaningful conversation or encounter. <b>Energy:</b> renewed motivation. <b>Path:</b> say yes to one invitation you would normally refuse."]),
("THIRD MOON · Days 61–90 · Manifestation",["Your Destiny card begins to show itself in real events. What was planted in the first moon starts to bloom. Many women report decisions finally being made, by them or by others.","<b>Love:</b> commitment, return or a new beginning. <b>Energy:</b> confidence. <b>Path:</b> act on the sentence you wrote in Chapter II."])]:
    box(t,lines)
st.append(Paragraph("Signs That Your Reading Is Unfolding",h2))
B(["Repeating numbers (11:11, 2:22, 3:33) appearing in your day.","Vivid dreams, especially of water, doors, or people from your past.","A sudden urge to clean, reorganise or let go of objects.","Unexpected messages from someone you had not heard from in a long time.","A feeling of calm that arrives without an obvious reason."])
# ---------- Blockages
chapter("CHAPTER V","Hidden Blockages","What has been holding you back")
P("Most women who come to the golden deck carry at least one of these four blockages. Read each one and notice which makes your chest tighten — that is the one asking to be healed.")
for t,d,r in [("The Blockage of the Unfinished Bond","A relationship that ended without closure continues to pull on your energy, even years later.","Write a letter to that person that you will never send. Say everything. Then burn it safely or tear it and release it into running water."),
("The Blockage of Self-Abandonment","You have been the strong one for everyone, and no one asks how you are.","For seven days, do one small thing each day only for yourself — and do not apologise for it."),
("The Blockage of Inherited Fear","Fears of scarcity, rejection or loneliness passed down through your family line.","Each night say: <i>\u201cI honour those who came before me, and I release what is not mine to carry.\u201d</i>"),
("The Blockage of Waiting","Life on pause, waiting for a sign, a person or the perfect moment.","Choose one decision you have postponed and take the smallest possible first step within 72 hours.")]:
    box(t.upper(),[d,"<font color='#ecd08f'>Release —</font> "+r])
# ---------- Ritual
chapter("CHAPTER VI","The Night Ritual of Activation","Three minutes to seal your reading")
P("This ritual anchors your reading into your energy. Do it on the first night you read this scroll, and then once a week for the next 90 days — ideally on the same day of the week.")
st.append(Paragraph("You Will Need",h2))
B(["A clear glass of water.","A small piece of paper and a pen.","(Optional) a candle, any colour, and a few minutes of silence."])
st.append(Paragraph("The Steps",h2))
for i,s in enumerate(["Write your first name and the sentence from Chapter II on the paper.","Place the glass of water on top of the paper, near your bed.","Hold your hands around the glass and breathe slowly three times.","Say: <i>\u201cWater that holds memory, hold my intention. As I sleep, let my path become clear.\u201d</i>","Sleep with the glass beside you. In the morning, pour the water onto a plant or into the earth — never down the drain.","Keep the paper inside this scroll or in a private place until the 90 days are complete."],1):
    st.append(Paragraph(s,bul,bulletText="%d."%i))
st.append(Paragraph("\u201cWhat you repeat with intention, the universe learns to recognise.\u201d",quote))
st.append(Paragraph("Daily 60-Second Practice",h2))
P("Every morning, before checking your phone, place a hand on your heart and ask: <i>\u201cWhat does my soul need today?\u201d</i> Accept the first word that comes. Let it guide one choice that day. You can also open your Personal Sanctuary each day to draw your card of the day and keep your candle lit.")
# ---------- Calendar
chapter("CHAPTER VII","Your 90-Day Sacred Calendar","Mark each week as you walk it")
rows=[["WEEK","FOCUS","PRACTICE","DONE"]]
foc=["Opening","Release the past","Rest & cleanse","Close a cycle","Notice signs","Open conversations","Say yes","Trust intuition","Take action","Receive","Commit","Celebrate","Integration"]
pr=["Night Ritual + read Ch. II","Unsent letter","Early nights, more water","Finish one pending task","Write down coincidences","Reach out to one person","Accept one invitation","Follow one gut feeling","First step of postponed decision","Allow help without guilt","Choose your path out loud","Honour how far you came","Final Night Ritual & re-read"]
for i in range(13): rows.append([str(i+1),foc[i],pr[i],"○"])
cs=S(fontName="Serif",fontSize=9,leading=12,textColor=TXT)
t=Table([[Paragraph(str(c),cs if r else S(fontName="Cinzel",fontSize=8.5,textColor=GOLD)) for c in row] for r,row in enumerate(rows)],colWidths=[40,120,235,45])
t.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.4,HexColor("#5a4526")),("BACKGROUND",(0,0),(-1,0),PANEL),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
st.append(t)
for title in ["My Reading in One Sentence","What I Am Releasing","Signs I Have Noticed","What Has Changed After 90 Days"]:
    st.append(PageBreak()) if title in ("My Reading in One Sentence","Signs I Have Noticed") else None
    st.append(Paragraph(title.upper(),h2))
    lines=Table([[""]]*9,colWidths=[W-150],rowHeights=[24]*9)
    lines.setStyle(TableStyle([("LINEBELOW",(0,0),(-1,-1),0.4,HexColor("#5a4526"))]));st.append(lines);st.append(Spacer(1,8))
# ---------- FAQ
chapter("CHAPTER VIII","Questions & Care","We are with you")
for q,a in [("When will I feel the effects of my reading?","Some women feel lighter on the first night. For most, the clearest signs appear between the second and sixth week. Energy moves at the speed your life allows — keep doing the weekly ritual and noting the signs."),
("What if a card felt negative?","No card is a curse. Challenging cards such as The Tower or Death speak of transformation, not punishment. Read their Light section again and remember: the Tarot warns so that you can choose differently."),
("Can I read this scroll more than once?","Yes, and you should. Return to it at the start of each moon. Different sentences will speak to you at different moments."),
("Where is my Personal Sanctuary?","Your purchase email contains a golden button to enter your Sanctuary. There you can draw a daily card, keep your altar candle lit, listen to healing frequencies and ask the Oracle — free, every day."),
("I did not receive an email or cannot open a file.","Check your spam or promotions folder first. If anything is missing, simply reply to your purchase email and our support guardian will help you, usually within a few hours. We solve every access question personally."),
("What will appear on my bank statement?","Your payment was processed securely and appears on your statement as <b>Jarik.co</b> (sometimes preceded by WHOP*). Please keep your purchase email as your receipt.")]:
    box(q,[a])
st.append(PageBreak());st.append(Spacer(1,220))
st.append(Paragraph("\u201cYou were guided here for a reason. Walk gently, walk awake, and never forget that the light you are looking for has always been inside you.\u201d",quote))
st.append(Paragraph("JARIK.CO  ·  SACRED CIRCLE",S(fontName="Cinzel",fontSize=10,textColor=GOLD,alignment=TA_CENTER)))
st.append(Spacer(1,14))
st.append(Paragraph("This reading is offered for spiritual guidance, reflection and entertainment. It does not replace medical, psychological, legal or financial advice. You remain the author of your own decisions.",S(parent=small,alignment=TA_CENTER)))

doc=BaseDocTemplate("/dev-server/public/downloads/sacred-golden-scroll.pdf",pagesize=A4,title="The Sacred Golden Scroll",author="Jarik.co")
fr=Frame(60,60,W-120,H-120,id="f")
doc.addPageTemplates([PageTemplate("cover",[Frame(60,60,W-120,H-120)],onPage=cover),PageTemplate("main",[fr],onPage=deco)])
st.insert(0,Spacer(1,1))
doc.build(st)
