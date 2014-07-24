class JobsController < ApplicationController
  before_filter :admin_user! #, :only => [:create_section,:create_dish,:create_option,:create_individual_option]
  layout 'jobs'
  
  def index
    @jobs = Job.all
  end
end
