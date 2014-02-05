module ApiHelper
  def validate_auth_token
  	# Rails.logger.warn "params: #{params.to_s}"
    user = User.where(:authentication_token => params[:foodcloud_token]).first
    render :status => 401, :json => {errors: [t('api.v1.token.invalid_token')]} if user.nil?
    # Rails.logger.warn user.to_json
    sign_in user
  end
end