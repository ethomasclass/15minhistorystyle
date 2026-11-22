# Paper: turns flat shapes into pieces of cut or torn paper, and gives them the shadows of paper that is lifted and
# laid down. The ideas are from claude-drawing-skill's paper styles (papercut, newscollage, overlay sheets, silhouette):
#   cut    scissors: the outline wanders a little, the sheet has fibres and tooth, and its thickness shows as a pale
#          lit edge on the upper left and a dark edge on the lower right
#   torn   tearing splits the paper in its thickness: a ragged outline with the pale core showing as an uneven rim
#   lift   a sheet held above the page is a touch larger, turned a little, and throws a wide soft shadow far from
#          itself; laid down, the shadow shrinks to a thin contact line (SHADOWS = 8 levels, sh0 = lying flat)
# These are SVG filters; pieces are rasterised once with them (tools/paper_pieces.mjs), then only moved.

N_SH = 8


def _fib(seed, kx=0.035, ky=0.6):
    return (f'<feTurbulence type="fractalNoise" baseFrequency="{kx} {ky}" numOctaves="2" seed="{seed}" result="f0"/>'
            f'<feColorMatrix in="f0" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="fib"/>'
            f'<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="{seed + 1}" result="t0"/>'
            f'<feColorMatrix in="t0" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="tooth"/>')


def _tex(src):
    return (f'<feComposite in="{src}" in2="fib" operator="arithmetic" k1="0.34" k2="0.83" k3="0" k4="0" result="x1"/>'
            f'<feComposite in="x1" in2="tooth" operator="arithmetic" k1="0.16" k2="0.92" k3="0" k4="0" result="tex"/>')


def defs():
    o = ''
    for name, seed, wob in (('cut', 3, 6), ('cut2', 11, 4), ('cutfine', 17, 1.6)):
        o += (f'<filter id="{name}" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">'
              f'<feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="{seed}" result="wob"/>'
              f'<feDisplacementMap in="SourceGraphic" in2="wob" scale="{wob}" xChannelSelector="R" yChannelSelector="G" result="shape"/>'
              + _fib(seed + 4) + _tex('shape') +
              '<feFlood flood-color="#fdf6e3" result="lf"/><feComposite in="lf" in2="shape" operator="in" result="lit0"/>'
              '<feOffset in="lit0" dx="-1.5" dy="-1.6" result="lit"/>'
              '<feFlood flood-color="#1c1a17" flood-opacity="0.45" result="df"/><feComposite in="df" in2="shape" operator="in" result="dk0"/>'
              '<feOffset in="dk0" dx="1.6" dy="1.9" result="dk"/>'
              '<feMerge><feMergeNode in="dk"/><feMergeNode in="lit"/><feMergeNode in="tex"/></feMerge></filter>')
    for name, seed in (('torn', 5), ('torn2', 23)):
        o += (f'<filter id="{name}" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">'
              f'<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="{seed}" result="w1"/>'
              f'<feDisplacementMap in="SourceGraphic" in2="w1" scale="15" xChannelSelector="R" yChannelSelector="G" result="s1"/>'
              f'<feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="2" seed="{seed + 2}" result="w2"/>'
              f'<feDisplacementMap in="s1" in2="w2" scale="5" xChannelSelector="G" yChannelSelector="R" result="shape"/>'
              + _fib(seed + 4, 0.05, 0.5) + _tex('shape') +
              '<feFlood flood-color="#f8f1dd" result="cf"/><feComposite in="cf" in2="shape" operator="in" result="c0"/>'
              '<feMorphology in="c0" operator="dilate" radius="4" result="c1"/>'
              f'<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="{seed + 7}" result="w3"/>'
              '<feDisplacementMap in="c1" in2="w3" scale="11" xChannelSelector="R" yChannelSelector="B" result="core"/>'
              '<feFlood flood-color="#1c1a17" flood-opacity="0.3" result="df"/><feComposite in="df" in2="core" operator="in" result="dk0"/>'
              '<feOffset in="dk0" dx="1.4" dy="1.8" result="dk"/>'
              '<feMerge><feMergeNode in="dk"/><feMergeNode in="core"/><feMergeNode in="tex"/></feMerge></filter>')
    o += ('<filter id="kraft" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
          '<feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" seed="31" result="c0"/>'
          '<feColorMatrix in="c0" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="cloud"/>'
          '<feComposite in="SourceGraphic" in2="cloud" operator="arithmetic" k1="0.5" k2="0.75" k3="0" k4="0" result="a"/>'
          + _fib(33, 0.02, 0.9) + _tex('a') + '</filter>')
    return o


def shadows():
    """sh0 (lying flat) ... sh7 (held well above the page)"""
    o = ''
    for k in range(N_SH):
        L = k / (N_SH - 1)
        o += (f'<filter id="sh{k}" x="-20%" y="-20%" width="150%" height="150%">'
              f'<feDropShadow dx="{2 + 26 * L:.1f}" dy="{3 + 34 * L:.1f}" stdDeviation="{1.3 + 15 * L:.1f}" flood-color="#1b2028" flood-opacity="{0.42 - 0.2 * L:.2f}"/></filter>')
    return o
