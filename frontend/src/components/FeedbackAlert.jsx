const FeedbackAlert = ({ feedback, className = 'mt-5' }) => {
    if (!feedback?.message) return null;
  
    const alertStyle =
      feedback.type === 'success'
        ? 'border border-green-200 bg-green-50 text-green-700'
        : 'border border-red-200 bg-red-50 text-red-700';
  
    return (
      <div className={`${className} rounded-2xl px-4 py-3 text-sm ${alertStyle}`}>
        {feedback.message}
      </div>
    );
  };
  
  export default FeedbackAlert;