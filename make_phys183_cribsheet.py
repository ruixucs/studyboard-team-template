import html

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak


OUTFILE = "phys183_cribsheet_A4_double_sided.pdf"


def section(title: str) -> str:
    return f"<b>{title}</b>"


def bullet(text: str) -> str:
    return f"• {text}"


def build_story():
    styles = getSampleStyleSheet()
    body = ParagraphStyle(
        "BodyTiny",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=6.2,
        leading=7.1,
        spaceAfter=1.2,
    )
    head = ParagraphStyle(
        "HeadTiny",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.0,
        leading=8.0,
        spaceAfter=1.8,
    )

    lines = [
        section("PHYS183 Ultra-Compact Crib Sheet (A4 double-sided)"),
        bullet("Core method 核心方法: observation 观测 + model 建模 + prediction 预测 + falsifiability 可证伪性 (Occam: prefer simpler model 更简洁模型)."),
        bullet("Units 单位: 1 AU=1.496e8 km; 1 ly=9.46e12 km; 1 pc=3.26 ly; 1 deg=60 arcmin=3600 arcsec; c=3.00e8 m/s."),
        bullet("Scientific notation 科学计数: a×10^n; multiply add exponents, divide subtract exponents."),
        "",
        section("Light, Spectra, Matter"),
        bullet("Wave-particle duality 波粒二象性: c=lambda*f ; E_photon=h*f (h=6.626e-34 J s)."),
        bullet("Thermal radiation 热辐射: lambda_peak*T = 2.9e6 K*nm (Wien). Hotter -> bluer/bluer peak."),
        bullet("Spectra 光谱: continuous 连续谱, emission 发射线, absorption 吸收线 (chemical fingerprint 化学指纹)."),
        bullet("Doppler shift 多普勒: (lambda_obs-lambda_emit)/lambda_emit = v_r/c ; + redshift 红移 (away), - blueshift 蓝移 (toward)."),
        bullet("Gravity 引力: F=G m1 m2 / r^2 ; stronger with mass, weaker with distance."),
        "",
        section("Telescopes & Observations"),
        bullet("Key telescope metrics 关键指标: light gathering 集光 ~ area ~ D^2; angular resolution 角分辨率 ~ lambda/D."),
        bullet("Diffraction limit 衍射极限(arcsec) ~ 2.5e5 * lambda(m)/D(m). Smaller is sharper."),
        bullet("Angular size 角尺度: theta(deg) ~ d*360/(2*pi*D)."),
        bullet("Atmosphere blurs seeing 大气扰动; fix via adaptive optics 自适应光学; interferometry 干涉测量 synthesizes larger baseline."),
        bullet("Space telescopes 太空望远镜 avoid atmospheric absorption/scattering."),
        "",
        section("Solar System, Formation, Geology, Atmospheres"),
        bullet("Planet definition 行星定义(IAU): orbit star; hydrostatic equilibrium; clear orbit."),
        bullet("Terrestrial 类地: rocky 高密度, few moons. Jovian 木行: H/He-rich 低密度, many moons+rings."),
        bullet("Nebular theory 星云理论: collapsing rotating cloud -> spinning disk -> Sun+planets; supported by protoplanetary disks."),
        bullet("Conservation of angular momentum 角动量守恒: L~mvr (isolated system constant)."),
        bullet("Solar system age 太阳系年龄 ~4.5 Gyr from radiometric dating 放射定年."),
        bullet("Planetary geology 行星地质 drivers: accretion+radioactive heating, cooling by convection/conduction/radiation."),
        bullet("Surface shaping 表面过程: impact cratering, volcanism, tectonics, erosion."),
        bullet("Atmosphere 大气: pressure decreases with altitude; greenhouse 温室效应 warms lower atmosphere."),
        bullet("Climate controls 气候因素: solar luminosity, albedo 反照率, tilt 倾角, greenhouse gases 温室气体."),
        bullet("Venus: runaway greenhouse 失控温室, high CO2, ~90 bar. Mars: thin atmosphere, likely solar-wind stripping after magnetic field loss."),
        "",
        section("Jovian Worlds & Exoplanets"),
        bullet("Jupiter: rapid rotation, strong magnetosphere, emits more than absorbed (ongoing contraction)."),
        bullet("Galilean moons: Io tidal heating 潮汐加热 volcanism; Europa subsurface ocean likely."),
        bullet("Exoplanet methods 系外行星探测: direct imaging, transit, radial velocity, astrometry, microlensing."),
        bullet("Transit depth gives R_p/R_star; period gives orbital period P."),
        bullet("Radial velocity 振幅 gives planet mass lower limit M_p sin i; true mass=M_measured/sin(i)."),
        bullet("Kepler/Newton form: P^2 = 4*pi^2 a^3 / [G(M_star+M_p)]."),
        bullet("Population stats 种群统计: many close-in planets (selection effects + migration 迁移); hot Jupiters, super-Earths common."),
        bullet("Habitability 宜居条件: liquid water, atmosphere, magnetic protection, long-term stability."),
        "",
        "__PAGE_BREAK__",
        "",
        section("The Sun"),
        bullet("Sun basics: M_sun~2e30 kg, R_sun~7e5 km, L_sun~3.8e26 W, age~4.6 Gyr."),
        bullet("Energy source 能源: H fusion (pp chain) not chemical/gravitational alone."),
        bullet("Mass-energy: E=mc^2 ; ~0.7% mass converted per 4H->He cycle."),
        bullet("Hydrostatic equilibrium 流体静力平衡: gravity inward = pressure outward."),
        bullet("Energy transport 能量输运: core fusion -> radiative zone -> convective zone -> photosphere."),
        bullet("Photon random walk 光子随机游走 takes ~2e5 years to surface; neutrinos escape quickly."),
        bullet("Solar neutrino problem resolved by neutrino oscillation 中微子振荡."),
        bullet("Magnetic activity 磁活动: sunspots (~11-yr cycle), flares/CMEs affect Earth aurora and grids."),
        "",
        section("Stars: Measuring Properties"),
        bullet("Flux-luminosity relation: F=L/(4*pi*d^2).  F apparent flux 视亮度, L intrinsic luminosity 本征光度."),
        bullet("Parallax 视差: d(pc)=1/p(arcsec).  p = parallax angle 视差角."),
        bullet("Spectral classes 光谱型: OBAFGKM (hot->cool: O hottest, M coolest)."),
        bullet("Stellar temperatures ~3000-50000 K; Sun ~5800 K."),
        bullet("Binary stars 双星 give mass via orbital dynamics."),
        bullet("Binary Kepler law: P^2 = 4*pi^2 a^3 / [G(M1+M2)]."),
        bullet("Circular orbit speed: v=2*pi*r/P."),
        "",
        section("HR Diagram & Stellar Evolution"),
        bullet("HR diagram: y=L, x=T (decreasing to right)."),
        bullet("Main Sequence 主序: core H fusion; not an age line, mostly a mass sequence."),
        bullet("Stefan-Boltzmann: L=4*pi*R^2*sigma*T^4 ; sigma=5.67e-8 W m^-2 K^-4."),
        bullet("So radius: R=sqrt(L/(4*pi*sigma*T^4))."),
        bullet("High mass stars: hotter, brighter, shorter life (consume fuel much faster)."),
        bullet("Low-mass path: main sequence -> red giant -> helium flash -> shell burning -> planetary nebula -> white dwarf."),
        bullet("High-mass path: successive fusion shells -> iron core collapse -> core-collapse SN -> neutron star/black hole."),
        bullet("Nucleosynthesis 元素合成: >He mainly from stars; >Fe mostly via explosive/rapid neutron-capture environments."),
        "",
        section("Compact Objects & Extreme Events"),
        bullet("White dwarf 白矮星: electron degeneracy support; size ~Earth; Chandrasekhar limit ~1.4 M_sun."),
        bullet("Nova 新星: surface H fusion on accreting WD (WD survives)."),
        bullet("Type Ia SN Ia: WD exceeds limit -> thermonuclear disruption (standard candle 标准烛光)."),
        bullet("Neutron star 中子星: neutron degeneracy support; pulsars 脉冲星 are rotating beamed NS."),
        bullet("Black hole 黑洞: event horizon 事件视界 at Schwarzschild radius R_s=2GM/c^2."),
        bullet("Nothing escapes inside horizon; mergers produce gravitational waves 引力波 (LIGO)."),
        "",
        section("Milky Way, Galaxies, Cosmology"),
        bullet("Milky Way: disk+spiral arms, bulge, halo; Sun in disk."),
        bullet("Galactic mass from orbits: M(<r)=r v^2/G . Flat rotation curves imply dark matter 暗物质 halo."),
        bullet("Gas recycling 气体循环: stars->winds/SN->ISM->molecular clouds->new stars."),
        bullet("Galaxy types 星系类型: spiral, elliptical, irregular; mergers can form ellipticals."),
        bullet("Distance ladder 距离阶梯: radar/parallax -> Cepheids -> Type Ia SNe."),
        bullet("Hubble law 哈勃定律: v=H0 d ; larger d => larger recession speed."),
        bullet("Cosmological principle 宇宙学原理: homogeneous 均匀 + isotropic 各向同性 (large scales)."),
        bullet("Universe age estimate 年龄估计: t~1/H0 (~13.8 Gyr)."),
        bullet("Open questions 开放问题: nature of dark matter, dark energy, life elsewhere (Drake equation 德雷克方程)."),
        "",
        section("Equation Variable Key 变量释义"),
        bullet("c speed of light 光速; lambda wavelength 波长; f frequency 频率; E energy 能量; h Planck constant 普朗克常数."),
        bullet("F gravitational force 引力; G grav. constant 引力常数; m,m1,m2 masses 质量; r distance/radius 距离/半径."),
        bullet("L luminosity 光度; F/flux 通量; d distance 距离; p parallax 视差角."),
        bullet("P orbital period 周期; a semi-major axis 半长轴; v velocity 速度; i inclination 倾角."),
        bullet("R stellar radius 恒星半径; T temperature 温度; sigma Stefan-Boltzmann const 斯特藩-玻尔兹曼常数."),
        bullet("M_sun solar mass 太阳质量; R_s Schwarzschild radius 史瓦西半径; H0 Hubble constant 哈勃常数."),
    ]

    story = []
    for ln in lines:
        if not ln:
            story.append(Spacer(1, 1.2))
            continue
        if ln == "__PAGE_BREAK__":
            story.append(PageBreak())
            continue
        if ln.startswith("<b>"):
            story.append(Paragraph(ln, head))
        else:
            story.append(Paragraph(html.escape(ln), body))
    return story


def main():
    page_w, page_h = A4
    margin = 8 * mm
    gutter = 4 * mm
    frame_w = (page_w - 2 * margin - gutter) / 2
    frame_h = page_h - 2 * margin

    frames = [
        Frame(margin, margin, frame_w, frame_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
        Frame(margin + frame_w + gutter, margin, frame_w, frame_h, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
    ]

    doc = BaseDocTemplate(
        OUTFILE,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin,
        title="PHYS183 Crib Sheet",
        author="Prepared by Codex",
    )
    doc.addPageTemplates([PageTemplate(id="TwoCol", frames=frames)])
    doc.build(build_story())
    print(f"Generated: {OUTFILE}")


if __name__ == "__main__":
    main()
