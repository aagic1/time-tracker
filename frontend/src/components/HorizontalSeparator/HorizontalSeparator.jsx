import styles from './horizontal-separator.module.css';

export default function HorizontalSeparator({
  text,
  textColor,
  lineColor,
  className,
}) {
  return (
    <div className={`${styles.lineContainer} ${className ? className : ''}`}>
      <div
        className={styles.line}
        style={lineColor ? { borderColor: lineColor } : {}}
      ></div>
      <div
        className={styles.lineText}
        style={textColor ? { color: textColor } : {}}
      >
        {text}
      </div>
      <div
        className={styles.line}
        style={lineColor ? { borderColor: lineColor } : {}}
      ></div>
    </div>
  );
}
