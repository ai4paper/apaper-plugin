# Theorem, Lemma, and Proposition Statements

Apply these rules on top of [PRINCIPLES.md](PRINCIPLES.md) whenever the task is to polish the formal *statement* of a theorem, lemma, proposition, or corollary — the block a reader cites, not its proof or the prose around it. Common in nonlinear-dynamics, IEEE-Transactions, and AMS-style manuscripts. A statement is a contract, not a paragraph: minimal hypotheses in, one prominent core conclusion out, corollaries after. Follow the IEEE tone in [JOURNAL.md](JOURNAL.md); defer general math typography (italic variables, roman functions, display layout) to [LATEX.md](LATEX.md) — the theorem-specific notation points are stated below. Never change the mathematical meaning.

## Eight Rules for a Statement

1. **Self-containedness.** The reader must parse the statement precisely without the surrounding text; declare every symbol and hypothesis it needs inside the statement.
2. **Logical correspondence.** Each hypothesis serves some conclusion; each conclusion names the object it governs. Never let one existential (e.g. $\Lambda$) syntactically govern a conclusion that is actually global — Li–Yorke chaos on $[0,1)$ holds independently of $\Lambda$, so it must not sit under "there exists $\Lambda$ such that …".
3. **Non-redundancy.** Delete any hypothesis or claim deducible from the rest; keep explanatory prose out of the body.
4. **Highlight the core contribution.** Put the strongest result at the center; demote direct corollaries and secondary properties. Here conjugacy to the full shift is core; Devaney chaos and $h_{\mathrm{top}}=\log l$ follow from it.
5. **Clear expression hierarchy.** State the existence claim first, then the properties the object satisfies; keep one logical level per sentence.
6. **Notation consistency.** Pick one name — "$f$" or "the LC map" — and use it throughout; never alternate.
7. **Avoid forward references.** Define each symbol at first appearance; assert that $\Lambda$ exists before discussing properties of $f|_\Lambda$.
8. **Rhythm and readability.** The logical spine should land in one pass: *under what hypotheses, there exists what object, with what core property, and hence what further conclusions.* This is the Devaney cadence — concise hypotheses, one prominent conclusion, corollaries after.

## Order the Statement: Existence First, Corollaries After

- **Spine:** minimal hypotheses -> existence claim -> single core property -> demoted consequences.
- Introduce results that follow from the core with "Consequently, …"; append a global or existential-independent claim with "Moreover, …".
- State the entropy value and Devaney chaos under "Consequently," not as separate enumerated items; put a property that does not depend on the existential object last.
- Prefer flowing display prose to an enumerated `(i)–(iii)` list when the items are not logically parallel — enumeration flattens the hierarchy.

## Placement and Notation

- **Placement.** Decide per piece of content whether it belongs in the statement, in the proof, or cited in the main text near the theorem — by importance. Move explanatory phrases ("the number of segments") and buried definitions ($l=\lceil\alpha+\beta\rceil$) out of the body: define $l$ before the theorem or as a display just after it.
- **Operator names.** Multi-letter operator names and subscripts take `\mathrm`: `h_{\mathrm{top}}`, not `h_{\text{top}}`.
- **Standard symbols.** Use the single symbol `\liminf`, not `\lim\inf`: prefer `$\liminf\limits_{m\to\infty}|f^m(x)-f^m(y)|=0$` over `$\mathop{\lim}\limits_{m\to\infty}\inf|{f^m}(x)-{f^m}(y)|=0$`.
- **Braces.** Minimize unnecessary braces in the source: `f^m`, not `{f^m}`.

## Worked Example

**Before** — mixed logical levels, redundant hypotheses, prose in the body, subject alternating between "the LC map" and "$f$":

```latex
\begin{theorem}
When $\alpha=p/q\in\mathbb{Q}\setminus\mathbb{Z}$
($p,q\in\mathbb{N}^+$, $p>q\ge 2$ and $\gcd(p,q)=1$) and $\alpha>1$,
there exists a nonempty compact invariant set $\Lambda\subset[0,1)$
such that the LC map meets:
\begin{enumerate}
  \item[(i)]   $f|_\Lambda$ is topologically conjugate to the $l$-ary full
               shift map $\sigma_l$, where $l=\lceil\alpha+\beta\rceil$ is
               the number of segments;
  \item[(ii)]  the topological entropy $h_{\text{top}}(f|_\Lambda)=\log l>0$,
               and $f|_\Lambda$ is Devaney chaotic;
  \item[(iii)] $f$ is Li--Yorke chaotic on $[0,1)$.
\end{enumerate}
\end{theorem}
```

**Fixes:** drop $\alpha\in\mathbb{Q}\setminus\mathbb{Z}$ (forced by $p>q$ with $\gcd(p,q)=1$) and `\log l>0` (forced by $\alpha>1$, i.e. $l\ge 2$); cut "is the number of segments"; unify the subject to $f$; move $l=\lceil\alpha+\beta\rceil$ next to the statement; demote the entropy formula to a "Consequently" clause; lift Li–Yorke chaos out from under $\Lambda$ to the end; write `h_{\mathrm{top}}`.

**After** — Devaney/AMS display style: minimal hypotheses, existence first, core property centered, consequences demoted:

```latex
\begin{theorem}
Let $f$ be the LC map with
\[
  \alpha=\frac{p}{q}>1,
\]
where $p$ and $q$ are coprime positive integers and $q\ge 2$. Then there
exists a nonempty compact invariant set $\Lambda\subset[0,1)$ such that
$f|_\Lambda$ is topologically conjugate to the $l$-ary full shift, where
\[
  l=\lceil\alpha+\beta\rceil.
\]
Consequently, $f|_\Lambda$ is Devaney chaotic and
\[
  h_{\mathrm{top}}(f|_\Lambda)=\log l.
\]
Moreover, the LC map $f$ is Li--Yorke chaotic on $[0,1)$.
\end{theorem}
```

**Compact single-paragraph IEEE variant** (same meaning, higher density):

```latex
\begin{theorem}
Let $f$ be LC map~(1) with $\alpha=p/q$, where $p,q\in\mathbb{N}^+$,
$p>q\ge 2$, and $\gcd(p,q)=1$. Then there exists a nonempty compact
invariant set $\Lambda\subset[0,1)$ such that $f|_\Lambda$ is topologically
conjugate to the $l$-ary full shift $\sigma_l$, where
$l=\lceil\alpha+\beta\rceil$. Consequently, $f|_\Lambda$ is Devaney chaotic
and $h_{\mathrm{top}}(f|_\Lambda)=\log l$. Moreover, $f$ is Li--Yorke
chaotic on $[0,1)$.
\end{theorem}
```

## Reusable Polishing Prompt

Prefer this seven-point prompt over a bare "polish this theorem":

> Please polish the theorem according to the following principles: 1) self-containedness; 2) minimal assumptions; 3) non-redundancy; 4) logical hierarchy of conclusions; 5) IEEE/AMS mathematical writing style; 6) maximum information density; 7) do not change the mathematical meaning.

Apply the fixes in this chain:

**self-containedness -> minimal assumptions -> non-redundancy -> logical hierarchy -> language conventions (IEEE/AMS) -> information density.**

The first four determine mathematical-expression quality; the last two determine professionalism and readability. For top math journals and IEEE Transactions, the first four matter far more than pure language polishing — do them first.
