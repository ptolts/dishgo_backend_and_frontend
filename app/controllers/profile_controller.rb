class ProfileController < ApplicationController
  before_filter :authenticate_user!

  layout 'administration'

  def profile
    render 'profile'
  end

end
