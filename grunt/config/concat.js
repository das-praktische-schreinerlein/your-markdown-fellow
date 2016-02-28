(function () {
    'use strict';

    module.exports = {
        options: {
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
        },
        vendors: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %>-v<%= pkg.version %> vendors-<%= pkg.vendorversion %> */\n\n'
            },
            files: {
                '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>.js': ['<%= vendorJsFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>.css': ['<%= vendorCssFiles %>'],
                '<%= destBase %>dist/jsh-vendors-<%= pkg.jshversion %>.js': ['<%= vendorJshJsFiles %>'],
                '<%= destBase %>dist/jsh-vendors-<%= pkg.jshversion %>.css': ['<%= vendorJshCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-vendors.js': ['<%= vendorJsFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-vendors.css': ['<%= vendorCssFiles %>'],
                '<%= destBase %>dist/jsh-vendors.js': ['<%= vendorJshJsFiles %>'],
                '<%= destBase %>dist/jsh-vendors.css': ['<%= vendorJshCssFiles %>']
            }
        },
        reset: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %>-v<%= pkg.version %> reset-<%= pkg.resetversion %> */\n\n'
            },
            files: {
                '<%= destBase %>dist/<%= pkg.name %>-reset-<%= pkg.resetversion %>.css': ['<%= projectResetCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-reset.css': ['<%= projectResetCssFiles %>']
            }
        },
        app: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %>-v<%= pkg.version %> app-<%= pkg.appversion %> */\n\n'
            },
            files: {
                '<%= destBase %>dist/<%= pkg.name %>-app-dist-<%= pkg.appversion %>.js': ['<%= projectJsFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-dist-<%= pkg.appversion %>.css': ['<%= projectCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-print-<%= pkg.appversion %>.css': ['<%= projectPrintCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-print-dataonly-<%= pkg.appversion %>.css': ['<%= projectPrintDataOnlyCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-dist.js': ['<%= projectJsFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-dist.css': ['<%= projectCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-print.css': ['<%= projectPrintCssFiles %>'],
                '<%= destBase %>dist/<%= pkg.name %>-app-print-dataonly.css': ['<%= projectPrintDataOnlyCssFiles %>']
            }
        },
        jsh: {
            options: {
                stripBanners: true,
                banner: '/*! jsh-<%= pkg.jshversion %> */\n\n'
            },
            files: {
                '<%= destBase %>dist/jsh-dist-<%= pkg.jshversion %>.js': ['<%= projectJshJsFiles %>'],
                '<%= destBase %>dist/jsh-dist-<%= pkg.jshversion %>.css': ['<%= projectJshCssFiles %>'],
                '<%= destBase %>dist/jsh-print-<%= pkg.jshversion %>.css': ['<%= projectJshPrintCssFiles %>'],
                '<%= destBase %>dist/jsh-print-dataonly-<%= pkg.jshversion %>.css': ['<%= projectPrintDataOnlyCssFiles %>'],
                '<%= destBase %>dist/jsh-dist.js': ['<%= projectJshJsFiles %>'],
                '<%= destBase %>dist/jsh-dist.css': ['<%= projectJshCssFiles %>'],
                '<%= destBase %>dist/jsh-print.css': ['<%= projectJshPrintCssFiles %>'],
                '<%= destBase %>dist/jsh-print-dataonly.css': ['<%= projectPrintDataOnlyCssFiles %>']
            }
        }
    };
})();
