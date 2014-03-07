class ProfileController < ApplicationController
  before_filter :authenticate_user!

  layout 'administration'

  def edit
    render 'edit'
  end

end
