CFG={}
from reportlab.lib.pagesizes import A4
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, NextPageTemplate
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math
pdfmetrics.registerFont(TTFont("Sym",__import__("subprocess").check_output(["fc-match","-f","%{file}","DejaVu Sans"],text=True).strip()))
pdfmetrics.registerFont(TTFont("Cinzel",__import__("os").path.join(__import__("os").path.dirname(__file__),"fonts","cinzel.ttf")))
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
    c.drawCentredString(W/2,38,CFG["footer"]+"  ·  JARIK.CO  ·  %d"%doc.page)
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
    c.setFillColor(GOLDL);c.setFont("Cinzel",11);c.drawCentredString(W/2,H-95,CFG["kicker"])
    c.setFont("Cinzel",38);c.drawCentredString(W/2,H/2-90,CFG["t1"]);c.drawCentredString(W/2,H/2-135,CFG["t2"])
    c.setFillColor(TXT);c.setFont("SerifI",13);c.drawCentredString(W/2,H/2-172,CFG["sub"])
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

def build(path,title):
    doc=BaseDocTemplate(path,pagesize=A4,title=title,author="Jarik.co")
    doc.addPageTemplates([PageTemplate("cover",[Frame(60,60,W-120,H-120)],onPage=cover),PageTemplate("main",[Frame(60,60,W-120,H-120)],onPage=deco)])
    st.insert(0,Spacer(1,1));st.insert(1,NextPageTemplate("main"));doc.build(st)
