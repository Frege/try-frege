package tryfrege;

public class ReplResponse {
	
	private final String message;
	private final MessageType messageType;
	
	public ReplResponse(final String message, final MessageType messageType) {
		this.message = message;
		this.messageType = messageType;
	}

	public String getMessage() {
		return message;
	}

	public MessageType getMessageType() {
		return messageType;
	}

}
