import { formatDate, getInitials } from "../utils/format";

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="flex space-x-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0a0a38] flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(comment.user.name)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-semibold text-slate-900">
                {comment.user.name}
              </p>
              <span className="text-xs text-slate-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-slate-700">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
